import WidgetKit
import SwiftUI

// MARK: - Payload models

struct WidgetTask: Codable, Identifiable {
    let id: String
    let title: String
    let color: String?
    let glyph: String?
    let nextDueDate: Double
    let isDueToday: Bool?
    let isOverdue: Bool?
    let isCompletedToday: Bool?
    let details: String?
}

struct WidgetStats: Codable {
    let overdueCount: Int
    let todayCount: Int
    let doneTodayCount: Int
    let moreDueThisWeekCount: Int
    let streak: Int
    let onTimePct: Int
}

// MARK: - Entry

struct SimpleEntry: TimelineEntry {
    let date: Date
    let configuration: ConfigurationAppIntent
    let tasks: [WidgetTask]
    let stats: WidgetStats?
}

// MARK: - Provider

struct Provider: AppIntentTimelineProvider {
    private let appGroup = "group.dev.kadi.cadence"

    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(
            date: Date(),
            configuration: ConfigurationAppIntent(),
            tasks: placeholderTasks(),
            stats: placeholderStats()
        )
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
        let (tasks, stats) = loadPayload()
        return SimpleEntry(date: Date(), configuration: configuration, tasks: tasks, stats: stats)
    }

    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
        let (tasks, stats) = loadPayload()
        let entry = SimpleEntry(date: Date(), configuration: configuration, tasks: tasks, stats: stats)
        let nextUpdate = Calendar.current.date(byAdding: .hour, value: 1, to: Date())!
        return Timeline(entries: [entry], policy: .after(nextUpdate))
    }

    private func loadPayload() -> ([WidgetTask], WidgetStats?) {
        guard let defaults = UserDefaults(suiteName: appGroup) else { return ([], nil) }
        let decoder = JSONDecoder()

        var tasks: [WidgetTask] = []
        if let tasksJson = defaults.string(forKey: "widget_tasks"),
           tasksJson != "null",
           let data = tasksJson.data(using: .utf8),
           let decoded = try? decoder.decode([WidgetTask].self, from: data) {
            tasks = decoded
        }

        var stats: WidgetStats?
        if let statsJson = defaults.string(forKey: "widget_stats"),
           statsJson != "null",
           let data = statsJson.data(using: .utf8),
           let decoded = try? decoder.decode(WidgetStats.self, from: data) {
            stats = decoded
        }

        return (tasks, stats)
    }

    private func placeholderTasks() -> [WidgetTask] {
        [
            WidgetTask(id: "1", title: "Water the plants", color: "green", glyph: "plant",
                       nextDueDate: Date().timeIntervalSince1970 * 1000,
                       isDueToday: true, isOverdue: false, isCompletedToday: false, details: nil),
            WidgetTask(id: "2", title: "Take out recycling", color: "brown", glyph: "trash",
                       nextDueDate: (Date().timeIntervalSince1970 + 86400) * 1000,
                       isDueToday: false, isOverdue: false, isCompletedToday: false, details: nil),
            WidgetTask(id: "3", title: "Car wash", color: "blue", glyph: "car",
                       nextDueDate: (Date().timeIntervalSince1970 + 2 * 86400) * 1000,
                       isDueToday: false, isOverdue: false, isCompletedToday: false, details: nil),
        ]
    }

    private func placeholderStats() -> WidgetStats {
        WidgetStats(overdueCount: 0, todayCount: 1, doneTodayCount: 0,
                    moreDueThisWeekCount: 2, streak: 7, onTimePct: 92)
    }
}

// MARK: - Date helpers

private func daysUntil(_ timestampMs: Double) -> Int {
    let due = Date(timeIntervalSince1970: timestampMs / 1000.0)
    let calendar = Calendar.current
    let today = calendar.startOfDay(for: Date())
    let dueDay = calendar.startOfDay(for: due)
    return calendar.dateComponents([.day], from: today, to: dueDay).day ?? 0
}

private func formatDueIn(_ timestampMs: Double) -> String {
    let diff = daysUntil(timestampMs)
    if diff < -1 { return "\(abs(diff))d overdue" }
    if diff == -1 { return "1d overdue" }
    if diff == 0 { return "Today" }
    if diff == 1 { return "Tomorrow" }
    if diff < 7 { return "in \(diff)d" }
    if diff < 14 { return "Next week" }
    if diff < 30 { return "in \(Int(round(Double(diff) / 7.0)))w" }
    if diff < 365 { return "in \(Int(round(Double(diff) / 30.0)))mo" }
    return "in \(Int(round(Double(diff) / 365.0)))y"
}

private func taskStatus(_ task: WidgetTask) -> (overdue: Bool, dueToday: Bool) {
    if task.isOverdue == true { return (true, false) }
    if task.isDueToday == true { return (false, true) }
    return (false, false)
}

// MARK: - Shared building blocks

struct TaskTileView: View {
    let task: WidgetTask
    var size: CGFloat = 28

    var body: some View {
        let t = taskTint(forColor: task.color ?? "gray")
        let status = taskStatus(task)
        let bgLight: Color = status.overdue ? Color(.sRGB, red: 1, green: 0.9, blue: 0.9, opacity: 1) : t.tintLight
        let fg: Color = status.overdue ? Color(.sRGB, red: 1, green: 0.23, blue: 0.19, opacity: 1) : t.accent

        RoundedRectangle(cornerRadius: max(7, size * 0.28), style: .continuous)
            .fill(bgLight)
            .frame(width: size, height: size)
            .overlay(
                Image(systemName: sfSymbol(forGlyph: task.glyph ?? "entry"))
                    .font(.system(size: size * 0.52, weight: .semibold))
                    .foregroundColor(fg)
            )
    }
}

// MARK: - Small: Next-up

struct SmallView: View {
    let entry: Provider.Entry

    var body: some View {
        let active = entry.tasks.filter { !($0.isCompletedToday ?? false) }
        let next = active.first
        let nextInThisWeekBucket = next.map {
            !($0.isOverdue ?? false) && !($0.isDueToday ?? false)
        } ?? false
        let remaining = max(
            0,
            (entry.stats?.moreDueThisWeekCount ?? 0)
                - (nextInThisWeekBucket ? 1 : 0)
        )
        let urgent = (entry.stats?.overdueCount ?? 0)
            + (entry.stats?.todayCount ?? 0)

        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text("Cadence")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(next != nil
                        ? taskTint(forColor: next!.color ?? "blue").accent
                        : .accentColor)
                    .kerning(-0.2)
                Spacer()
                Text("\(urgent)")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(.primary)
            }
            Spacer(minLength: 4)

            if let t = next {
                let status = taskStatus(t)
                HStack(alignment: .center, spacing: 8) {
                    TaskTileView(task: t, size: 28)
                    VStack(alignment: .leading, spacing: 1) {
                        Text(t.title)
                            .font(.system(size: 13, weight: .semibold))
                            .lineLimit(1)
                            .foregroundColor(.primary)
                        Text(formatDueIn(t.nextDueDate))
                            .font(.system(size: 11, weight: .medium))
                            .foregroundColor(
                                status.overdue ? .red
                                    : status.dueToday ? .blue
                                    : .secondary
                            )
                    }
                    Spacer(minLength: 0)
                }
                if remaining > 0 {
                    Text("\(remaining) more due this week")
                        .font(.system(size: 11))
                        .foregroundColor(.secondary.opacity(0.85))
                        .padding(.top, 6)
                }
            } else {
                Spacer()
                Text("All clear")
                    .font(.system(size: 13))
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity, alignment: .center)
                Spacer()
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }
}

// MARK: - Medium: 3-row list

struct MediumView: View {
    let entry: Provider.Entry

    var body: some View {
        let active = entry.tasks.filter { !($0.isCompletedToday ?? false) }
        let rows = Array(active.prefix(3))

        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text("Cadence")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(.accentColor)
                Spacer()
                Text("\(active.count) to do")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(.secondary)
            }
            if rows.isEmpty {
                Spacer()
                Text("All clear")
                    .font(.system(size: 14))
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity, alignment: .center)
                Spacer()
            } else {
                VStack(spacing: 8) {
                    ForEach(rows) { task in
                        TaskRowView(task: task)
                    }
                }
                .frame(maxHeight: .infinity, alignment: .top)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }
}

struct TaskRowView: View {
    let task: WidgetTask

    var body: some View {
        let status = taskStatus(task)
        HStack(spacing: 9) {
            TaskTileView(task: task, size: 24)
            Text(task.title)
                .font(.system(size: 12, weight: .medium))
                .lineLimit(1)
                .foregroundColor(.primary)
            Spacer(minLength: 4)
            Text(formatDueIn(task.nextDueDate))
                .font(.system(size: 11, weight: .semibold))
                .foregroundColor(
                    status.overdue ? .red
                        : status.dueToday ? .blue
                        : .secondary
                )
        }
    }
}

// MARK: - Large: counts strip + 5-row list

struct LargeView: View {
    let entry: Provider.Entry

    var body: some View {
        let stats = entry.stats
        let active = entry.tasks.filter { !($0.isCompletedToday ?? false) }
        let rows = Array(active.prefix(5))

        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text("Cadence")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.accentColor)
                Spacer()
                if let s = stats {
                    Text("\(s.streak)🔥 · \(s.onTimePct)% on-time")
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(.secondary)
                }
            }
            if let s = stats {
                HStack(spacing: 8) {
                    CountPill(label: "OVERDUE", value: s.overdueCount, color: .red)
                    CountPill(label: "TODAY", value: s.todayCount, color: .blue)
                    CountPill(label: "DONE", value: s.doneTodayCount, color: .green)
                }
            }
            if rows.isEmpty {
                Spacer()
                Text("All clear")
                    .font(.system(size: 14))
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity, alignment: .center)
                Spacer()
            } else {
                VStack(spacing: 9) {
                    ForEach(rows) { task in
                        TaskRowView(task: task)
                    }
                }
                .frame(maxHeight: .infinity, alignment: .top)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }
}

struct CountPill: View {
    let label: String
    let value: Int
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(label)
                .font(.system(size: 10, weight: .semibold))
                .foregroundColor(.secondary)
                .kerning(0.4)
            Text("\(value)")
                .font(.system(size: 22, weight: .bold))
                .foregroundColor(.primary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.leading, 10)
        .overlay(
            Rectangle()
                .fill(color)
                .frame(width: 3)
                .clipShape(RoundedRectangle(cornerRadius: 1.5)),
            alignment: .leading
        )
    }
}

// MARK: - Entry view + widget config

struct widgetEntryView: View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        switch family {
        case .systemLarge:
            LargeView(entry: entry)
        case .systemMedium:
            MediumView(entry: entry)
        default:
            SmallView(entry: entry)
        }
    }
}

struct widget: Widget {
    let kind: String = "widget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
            widgetEntryView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .configurationDisplayName("Cadence")
        .description("See what's due at a glance.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

// MARK: - Previews

#Preview(as: .systemSmall) {
    widget()
} timeline: {
    SimpleEntry(
        date: .now,
        configuration: ConfigurationAppIntent(),
        tasks: [
            WidgetTask(id: "1", title: "Water the plants", color: "green", glyph: "plant",
                       nextDueDate: Date().timeIntervalSince1970 * 1000,
                       isDueToday: true, isOverdue: false, isCompletedToday: false, details: nil),
        ],
        stats: WidgetStats(overdueCount: 0, todayCount: 1, doneTodayCount: 0,
                           moreDueThisWeekCount: 2, streak: 7, onTimePct: 92)
    )
}

#Preview(as: .systemMedium) {
    widget()
} timeline: {
    SimpleEntry(
        date: .now,
        configuration: ConfigurationAppIntent(),
        tasks: [
            WidgetTask(id: "1", title: "Water the plants", color: "green", glyph: "plant",
                       nextDueDate: Date().timeIntervalSince1970 * 1000,
                       isDueToday: true, isOverdue: false, isCompletedToday: false, details: nil),
            WidgetTask(id: "2", title: "Take out recycling", color: "brown", glyph: "trash",
                       nextDueDate: (Date().timeIntervalSince1970 + 86400) * 1000,
                       isDueToday: false, isOverdue: false, isCompletedToday: false, details: nil),
            WidgetTask(id: "3", title: "Car wash", color: "blue", glyph: "car",
                       nextDueDate: (Date().timeIntervalSince1970 + 2 * 86400) * 1000,
                       isDueToday: false, isOverdue: false, isCompletedToday: false, details: nil),
        ],
        stats: WidgetStats(overdueCount: 1, todayCount: 1, doneTodayCount: 0,
                           moreDueThisWeekCount: 2, streak: 7, onTimePct: 92)
    )
}

#Preview(as: .systemLarge) {
    widget()
} timeline: {
    SimpleEntry(
        date: .now,
        configuration: ConfigurationAppIntent(),
        tasks: [
            WidgetTask(id: "0", title: "Replace toothbrush head", color: "pink", glyph: "pill",
                       nextDueDate: (Date().timeIntervalSince1970 - 5 * 86400) * 1000,
                       isDueToday: false, isOverdue: true, isCompletedToday: false, details: nil),
            WidgetTask(id: "1", title: "Water the plants", color: "green", glyph: "plant",
                       nextDueDate: Date().timeIntervalSince1970 * 1000,
                       isDueToday: true, isOverdue: false, isCompletedToday: false, details: nil),
            WidgetTask(id: "2", title: "Take out recycling", color: "brown", glyph: "trash",
                       nextDueDate: (Date().timeIntervalSince1970 + 86400) * 1000,
                       isDueToday: false, isOverdue: false, isCompletedToday: false, details: nil),
            WidgetTask(id: "3", title: "Car wash", color: "blue", glyph: "car",
                       nextDueDate: (Date().timeIntervalSince1970 + 2 * 86400) * 1000,
                       isDueToday: false, isOverdue: false, isCompletedToday: false, details: nil),
            WidgetTask(id: "4", title: "Change bedsheets", color: "purple", glyph: "bed",
                       nextDueDate: (Date().timeIntervalSince1970 + 5 * 86400) * 1000,
                       isDueToday: false, isOverdue: false, isCompletedToday: false, details: nil),
        ],
        stats: WidgetStats(overdueCount: 1, todayCount: 1, doneTodayCount: 0,
                           moreDueThisWeekCount: 3, streak: 7, onTimePct: 92)
    )
}
