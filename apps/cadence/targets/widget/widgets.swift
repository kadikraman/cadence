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
    let totalCount: Int?
    let streak: Int
    let onTimePct: Int
}

// MARK: - Entry

struct SimpleEntry: TimelineEntry {
    let date: Date
    let tasks: [WidgetTask]
    let stats: WidgetStats?
}

// MARK: - Provider

struct Provider: TimelineProvider {
    typealias Entry = SimpleEntry

    private let appGroup = "group.dev.kadi.cadence"

    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(
            date: Date(),
            tasks: placeholderTasks(),
            stats: placeholderStats()
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> Void) {
        let (tasks, stats) = loadPayload()
        completion(SimpleEntry(date: Date(), tasks: tasks, stats: stats))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> Void) {
        let (tasks, stats) = loadPayload()
        let entry = SimpleEntry(date: Date(), tasks: tasks, stats: stats)
        completion(Timeline(entries: [entry], policy: .after(nextRefreshDate())))
    }

    // Refresh hourly — or at the next midnight, whichever is sooner — so "Today"
    // and "in Nd" labels always reflect the current day.
    private func nextRefreshDate() -> Date {
        let now = Date()
        let calendar = Calendar.current
        let hourOut = calendar.date(byAdding: .hour, value: 1, to: now) ?? now
        guard let tomorrow = calendar.date(byAdding: .day, value: 1, to: now) else {
            return hourOut
        }
        let startOfTomorrow = calendar.startOfDay(for: tomorrow)
        return min(hourOut, startOfTomorrow)
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
            WidgetTask(id: "3", title: "Car wash", color: "teal", glyph: "car",
                       nextDueDate: (Date().timeIntervalSince1970 + 2 * 86400) * 1000,
                       isDueToday: false, isOverdue: false, isCompletedToday: false, details: nil),
        ]
    }

    private func placeholderStats() -> WidgetStats {
        WidgetStats(overdueCount: 0, todayCount: 1, doneTodayCount: 0,
                    moreDueThisWeekCount: 2, totalCount: 6, streak: 7, onTimePct: 92)
    }
}

// MARK: - Brand colors

private let cadenceBlue = Color(.sRGB, red: 0.04, green: 0.52, blue: 1.0, opacity: 1)
private let cadenceGreen = Color(.sRGB, red: 0.20, green: 0.78, blue: 0.35, opacity: 1)
private let cadenceRed = Color(.sRGB, red: 1.00, green: 0.23, blue: 0.19, opacity: 1)

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
    if diff < 0 { return "\(abs(diff))d late" }
    if diff == 0 { return "TODAY" }
    if diff < 30 { return "\(diff)d" }
    if diff < 365 { return "\(Int(round(Double(diff) / 30.0)))mo" }
    return "\(Int(round(Double(diff) / 365.0)))y"
}

private func taskStatus(_ task: WidgetTask) -> (overdue: Bool, dueToday: Bool) {
    if task.isOverdue == true { return (true, false) }
    if task.isDueToday == true { return (false, true) }
    return (false, false)
}

private func activeTasks(_ tasks: [WidgetTask]) -> [WidgetTask] {
    tasks.filter { !($0.isCompletedToday ?? false) }
}

private func urgentCount(_ stats: WidgetStats?) -> Int {
    (stats?.overdueCount ?? 0) + (stats?.todayCount ?? 0)
}

// MARK: - Rhythm mark (empty state illustration)

struct RhythmMark: View {
    var size: CGFloat = 44

    var body: some View {
        ZStack {
            ForEach([size, size * 0.72, size * 0.45], id: \.self) { s in
                Circle()
                    .stroke(
                        markColor(for: s),
                        style: StrokeStyle(
                            lineWidth: 1.25,
                            lineCap: .round,
                            dash: [3, 4]
                        )
                    )
                    .frame(width: s, height: s)
                    .opacity(0.55)
            }
        }
        .frame(width: size, height: size)
    }

    private func markColor(for s: CGFloat) -> Color {
        if s > size * 0.85 { return cadenceGreen }
        if s > size * 0.6 { return Color(.sRGB, red: 0.19, green: 0.69, blue: 0.78, opacity: 1) }
        return Color(.sRGB, red: 1.00, green: 0.58, blue: 0.00, opacity: 1)
    }
}

// MARK: - Shared building blocks

struct TaskTileView: View {
    @Environment(\.colorScheme) var colorScheme
    let task: WidgetTask
    var size: CGFloat = 28

    var body: some View {
        let t = taskTint(forColor: task.color ?? "gray")
        let status = taskStatus(task)
        let isDark = colorScheme == .dark
        let overdueBg: Color = isDark
            ? Color(.sRGB, red: 1, green: 0.27, blue: 0.23, opacity: 0.20)
            : Color(.sRGB, red: 1, green: 0.9, blue: 0.9, opacity: 1)
        let bg: Color = status.overdue
            ? overdueBg
            : (isDark ? t.tintDark : t.tintLight)
        let fg: Color = status.overdue
            ? cadenceRed
            : (isDark ? t.accentDark : t.accent)

        RoundedRectangle(cornerRadius: max(7, size * 0.28), style: .continuous)
            .fill(bg)
            .frame(width: size, height: size)
            .overlay(
                Image(systemName: sfSymbol(forGlyph: task.glyph ?? "entry"))
                    .font(.system(size: size * 0.52, weight: .semibold))
                    .foregroundColor(fg)
            )
    }
}

struct TaskRowView: View {
    let task: WidgetTask
    var iconSize: CGFloat = 28
    var titleSize: CGFloat = 14
    var dueSize: CGFloat = 12

    var body: some View {
        let status = taskStatus(task)
        HStack(spacing: 10) {
            TaskTileView(task: task, size: iconSize)
            Text(task.title)
                .font(.system(size: titleSize, weight: .semibold))
                .lineLimit(1)
                .foregroundColor(.primary)
            Spacer(minLength: 4)
            Text(formatDueIn(task.nextDueDate))
                .font(.system(size: dueSize, weight: .semibold))
                .foregroundColor(
                    status.overdue ? cadenceRed
                        : status.dueToday ? cadenceBlue
                        : .secondary
                )
        }
    }
}

// MARK: - Small

private let allClearGreen = Color(.sRGB, red: 0.106, green: 0.478, blue: 0.20, opacity: 1)

struct SmallView: View {
    let entry: Provider.Entry

    var body: some View {
        let active = activeTasks(entry.tasks)
        let overdue = active.filter { $0.isOverdue == true }
        let today = active.filter { !($0.isOverdue == true) && ($0.isDueToday == true) }
        let urgent = overdue + today
        let upcoming = active.filter {
            !($0.isOverdue == true) && !($0.isDueToday == true)
        }

        if entry.tasks.isEmpty {
            smallEmpty
        } else if urgent.isEmpty {
            smallAllClear(upcoming: upcoming)
        } else if urgent.count == 1 && upcoming.isEmpty {
            smallSingleHero(task: urgent[0])
        } else {
            smallList(urgent: urgent, upcoming: upcoming, hasOverdue: !overdue.isEmpty)
        }
    }

    private var smallEmpty: some View {
        VStack(alignment: .leading, spacing: 0) {
            smallHeader(count: nil, tone: .blue)
            Spacer()
            HStack {
                Spacer()
                VStack(spacing: 8) {
                    RhythmMark(size: 44)
                    Text("No tasks yet.\nOpen app to start.")
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .lineSpacing(1)
                }
                Spacer()
            }
            Spacer()
        }
    }

    private func smallAllClear(upcoming: [WidgetTask]) -> some View {
        let rows = Array(upcoming.prefix(2))
        return VStack(alignment: .leading, spacing: 0) {
            smallHeader(count: 0, tone: .green)
            HStack(spacing: 5) {
                ZStack {
                    Circle().fill(cadenceGreen)
                    Image(systemName: "checkmark")
                        .font(.system(size: 7, weight: .heavy))
                        .foregroundColor(.white)
                }
                .frame(width: 14, height: 14)
                Text("All clear today")
                    .font(.system(size: 10.5, weight: .bold))
                    .kerning(-0.1)
                    .foregroundColor(allClearGreen)
            }
            .padding(.leading, 5)
            .padding(.trailing, 8)
            .padding(.vertical, 3)
            .background(
                Capsule().fill(cadenceGreen.opacity(0.14))
            )
            .padding(.top, 10)

            if !rows.isEmpty {
                Spacer(minLength: 10)
                Text("NEXT UP")
                    .font(.system(size: 9.5, weight: .bold))
                    .kerning(0.5)
                    .foregroundColor(.secondary)
                    .padding(.bottom, 8)
                VStack(alignment: .leading, spacing: 10) {
                    ForEach(rows.indices, id: \.self) { i in
                        smallTaskRow(task: rows[i])
                    }
                }
            }
            Spacer(minLength: 0)
        }
    }

    private func smallSingleHero(task: WidgetTask) -> some View {
        let status = taskStatus(task)
        let eyebrow = status.overdue
            ? formatDueIn(task.nextDueDate).uppercased()
            : "TODAY"
        return VStack(alignment: .leading, spacing: 0) {
            smallHeader(count: 1, tone: status.overdue ? .red : .blue)
            Spacer(minLength: 0)
            VStack(alignment: .leading, spacing: 10) {
                TaskTileView(task: task, size: 42)
                VStack(alignment: .leading, spacing: 3) {
                    Text(eyebrow)
                        .font(.system(size: 10, weight: .bold))
                        .kerning(0.5)
                        .foregroundColor(status.overdue ? cadenceRed : cadenceBlue)
                    Text(task.title)
                        .font(.system(size: 17, weight: .bold))
                        .lineLimit(2)
                        .foregroundColor(.primary)
                }
            }
            Spacer(minLength: 0)
        }
    }

    private func smallList(urgent: [WidgetTask], upcoming: [WidgetTask], hasOverdue: Bool) -> some View {
        let urgentN = urgent.count
        let highCount = urgentN >= 5
        let tone: Tone = (hasOverdue || highCount) ? .red : .blue

        let rows: [WidgetTask]
        let overflow: Int
        if urgentN > 2 {
            rows = Array(urgent.prefix(2))
            overflow = urgentN - 2
        } else {
            let combined = urgent + upcoming
            rows = Array(combined.prefix(3))
            overflow = 0
        }

        return VStack(alignment: .leading, spacing: 0) {
            smallHeader(count: urgentN, tone: tone)
            Spacer(minLength: 6)
            VStack(spacing: 4) {
                ForEach(rows.indices, id: \.self) { i in
                    if i > 0 {
                        Rectangle()
                            .fill(Color.primary.opacity(0.06))
                            .frame(height: 1)
                    }
                    smallTaskRow(task: rows[i])
                }
                if overflow > 0 {
                    Rectangle()
                        .fill(Color.primary.opacity(0.06))
                        .frame(height: 1)
                    smallMoreRow(remaining: overflow)
                }
            }
            Spacer(minLength: 0)
        }
    }

    private func smallTaskRow(task: WidgetTask) -> some View {
        let status = taskStatus(task)
        return HStack(spacing: 8) {
            TaskTileView(task: task, size: 26)
            VStack(alignment: .leading, spacing: 1) {
                Text(task.title)
                    .font(.system(size: 12.5, weight: .semibold))
                    .kerning(-0.15)
                    .lineLimit(1)
                    .foregroundColor(.primary)
                Text(formatDueIn(task.nextDueDate))
                    .font(.system(size: 10.5, weight: .medium))
                    .foregroundColor(
                        status.overdue ? cadenceRed
                            : status.dueToday ? cadenceBlue
                            : .secondary
                    )
            }
            Spacer(minLength: 0)
        }
    }

    private func smallMoreRow(remaining: Int) -> some View {
        HStack(spacing: 8) {
            ZStack {
                RoundedRectangle(cornerRadius: 7, style: .continuous)
                    .fill(cadenceBlue.opacity(0.14))
                    .frame(width: 26, height: 26)
                Image(systemName: "ellipsis")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(cadenceBlue)
            }
            Text("+\(remaining) more today")
                .font(.system(size: 12.5, weight: .semibold))
                .kerning(-0.15)
                .foregroundColor(cadenceBlue)
                .lineLimit(1)
            Spacer(minLength: 0)
        }
    }

    private enum Tone { case blue, red, green }

    private func smallHeader(count: Int?, tone: Tone) -> some View {
        let countColor: Color = {
            switch tone {
            case .blue: return cadenceBlue
            case .red: return cadenceRed
            case .green: return cadenceGreen
            }
        }()
        return HStack(alignment: .firstTextBaseline) {
            Text("Cadence")
                .font(.system(size: 13, weight: .bold))
                .kerning(-0.2)
                .foregroundColor(cadenceBlue)
            Spacer()
            if let c = count {
                Text("\(c)")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(countColor)
            }
        }
    }
}

// MARK: - Medium

struct MediumView: View {
    let entry: Provider.Entry

    var body: some View {
        let active = activeTasks(entry.tasks)
        let overdue = active.filter { $0.isOverdue == true }
        let today = active.filter { !($0.isOverdue == true) && ($0.isDueToday == true) }
        let urgent = overdue + today
        let upcoming = active.filter {
            !($0.isOverdue == true) && !($0.isDueToday == true)
        }

        VStack(alignment: .leading, spacing: 6) {
            mediumHeader(
                empty: entry.tasks.isEmpty,
                overdue: overdue.count,
                today: today.count,
                hasUpcoming: !upcoming.isEmpty
            )

            if entry.tasks.isEmpty {
                mediumEmpty
            } else if urgent.isEmpty {
                mediumAllClear(upcoming: upcoming)
            } else {
                mediumList(urgent: urgent, upcoming: upcoming)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }

    private func mediumHeader(empty: Bool, overdue: Int, today: Int, hasUpcoming: Bool) -> some View {
        let label: String = {
            if empty { return "No tasks" }
            if overdue > 0 && today > 0 {
                return "\(overdue) overdue · \(today) today"
            }
            if overdue > 0 {
                return overdue == 1 ? "1 overdue" : "\(overdue) overdue"
            }
            if today == 0 { return "Nothing due today" }
            return today == 1 ? "1 due today" : "\(today) due today"
        }()
        return HStack {
            Text("Cadence")
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(cadenceBlue)
            Spacer()
            Text(label)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(overdue > 0 ? cadenceRed : today > 0 ? cadenceBlue : .secondary)
        }
    }

    private var mediumEmpty: some View {
        HStack(spacing: 14) {
            RhythmMark(size: 56)
            VStack(alignment: .leading, spacing: 4) {
                Text("Build your rhythm")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.primary)
                Text("Open Cadence to add your first recurring task.")
                    .font(.system(size: 11))
                    .foregroundColor(.secondary)
                    .lineLimit(2)
            }
            Spacer(minLength: 0)
        }
        .padding(.top, 4)
    }

    private func mediumAllClear(upcoming: [WidgetTask]) -> some View {
        let rows = Array(upcoming.prefix(2))
        return VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 10) {
                ZStack {
                    Circle().fill(cadenceGreen.opacity(0.15))
                    Image(systemName: "checkmark")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(cadenceGreen)
                }
                .frame(width: 28, height: 28)
                Text("All clear")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(.primary)
                Spacer(minLength: 0)
            }
            if !rows.isEmpty {
                Text("NEXT UP")
                    .font(.system(size: 9, weight: .bold))
                    .kerning(0.4)
                    .foregroundColor(.secondary)
                    .padding(.top, 2)
                VStack(spacing: 6) {
                    ForEach(rows) { task in
                        TaskRowView(
                            task: task,
                            iconSize: 24,
                            titleSize: 13,
                            dueSize: 11
                        )
                    }
                }
            }
        }
    }

    private func mediumList(urgent: [WidgetTask], upcoming: [WidgetTask]) -> some View {
        let combined = urgent + upcoming
        let rows = Array(combined.prefix(3))
        let remaining = max(0, urgent.count - rows.count)
        return VStack(spacing: 6) {
            ForEach(rows) { task in
                TaskRowView(task: task)
            }
            if remaining > 0 {
                HStack {
                    Text("+ \(remaining) more today")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(cadenceBlue)
                    Spacer()
                    Image(systemName: "play.fill")
                        .font(.system(size: 9))
                        .foregroundColor(cadenceBlue)
                }
                .padding(.top, 2)
            }
        }
        .frame(maxHeight: .infinity, alignment: .top)
    }
}

// MARK: - Large

struct LargeView: View {
    let entry: Provider.Entry

    var body: some View {
        let stats = entry.stats
        let active = activeTasks(entry.tasks)
        let overdue = active.filter { $0.isOverdue == true }
        let today = active.filter { !($0.isOverdue == true) && ($0.isDueToday == true) }
        let urgent = overdue + today
        let upcoming = active.filter {
            !($0.isOverdue == true) && !($0.isDueToday == true)
        }

        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text("Cadence")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(cadenceBlue)
                Spacer()
            }

            if entry.tasks.isEmpty {
                largeEmpty
            } else {
                if let s = stats {
                    largeStats(stats: s)
                }
                if urgent.isEmpty {
                    largeAllClear(upcoming: upcoming)
                } else {
                    largeTaskList(urgent: urgent, upcoming: upcoming)
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }

    private var largeEmpty: some View {
        VStack(spacing: 14) {
            Spacer()
            RhythmMark(size: 108)
            VStack(spacing: 6) {
                Text("Build your rhythm")
                    .font(.system(size: 17, weight: .bold))
                    .foregroundColor(.primary)
                Text("Add the things you do on a loop — Cadence will remind you when it's time.")
                    .font(.system(size: 12))
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: 240)
            }
            Text("Open to add task")
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(.white)
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .background(cadenceBlue)
                .clipShape(Capsule())
            Spacer()
        }
        .frame(maxWidth: .infinity)
    }

    private func largeStats(stats: WidgetStats) -> some View {
        let total = stats.totalCount ?? (entry.tasks.count)
        return HStack(spacing: 14) {
            CountPill(label: "OVERDUE", value: stats.overdueCount, color: cadenceRed)
            CountPill(label: "TODAY", value: stats.todayCount, color: cadenceBlue)
            CountPill(label: "TOTAL", value: total, color: .secondary)
        }
    }

    private func largeAllClear(upcoming: [WidgetTask]) -> some View {
        let rows = Array(upcoming.prefix(4))
        return VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 10) {
                ZStack {
                    Circle().fill(cadenceGreen.opacity(0.25))
                    Image(systemName: "checkmark")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(cadenceGreen)
                }
                .frame(width: 34, height: 34)
                Text("All clear today")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(Color(.sRGB, red: 0.11, green: 0.48, blue: 0.20, opacity: 1))
                Spacer()
            }
            .padding(10)
            .background(
                RoundedRectangle(cornerRadius: 12, style: .continuous)
                    .fill(cadenceGreen.opacity(0.12))
            )

            if !rows.isEmpty {
                Text("COMING UP")
                    .font(.system(size: 10, weight: .bold))
                    .kerning(0.6)
                    .foregroundColor(.secondary)
                    .padding(.top, 4)
                ForEach(rows.indices, id: \.self) { i in
                    if i > 0 {
                        Divider().background(Color.primary.opacity(0.06))
                    }
                    TaskRowView(task: rows[i])
                }
            }
        }
    }

    private func largeTaskList(urgent: [WidgetTask], upcoming: [WidgetTask]) -> some View {
        let combined = urgent + upcoming
        let maxRows = 6
        let overflow = max(0, urgent.count - maxRows)
        let visibleRows: [WidgetTask] = overflow > 0
            ? Array(urgent.prefix(maxRows))
            : Array(combined.prefix(maxRows))
        return VStack(spacing: 0) {
            ForEach(visibleRows.indices, id: \.self) { i in
                if i > 0 {
                    Divider().background(Color.primary.opacity(0.06))
                }
                TaskRowView(task: visibleRows[i])
                    .padding(.vertical, 6)
            }
            if overflow > 0 {
                HStack {
                    Text("+ \(overflow) more due today")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(cadenceBlue)
                    Spacer()
                    Image(systemName: "play.fill")
                        .font(.system(size: 9))
                        .foregroundColor(cadenceBlue)
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 7)
                .background(
                    RoundedRectangle(cornerRadius: 10, style: .continuous)
                        .fill(cadenceBlue.opacity(0.08))
                )
                .padding(.top, 6)
            }
        }
        .frame(maxHeight: .infinity, alignment: .top)
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
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
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
        tasks: [
            WidgetTask(id: "1", title: "Water the plants", color: "green", glyph: "plant",
                       nextDueDate: Date().timeIntervalSince1970 * 1000,
                       isDueToday: true, isOverdue: false, isCompletedToday: false, details: nil),
            WidgetTask(id: "2", title: "Take out the trash", color: "slate", glyph: "trash",
                       nextDueDate: Date().timeIntervalSince1970 * 1000,
                       isDueToday: true, isOverdue: false, isCompletedToday: false, details: nil),
        ],
        stats: WidgetStats(overdueCount: 0, todayCount: 2, doneTodayCount: 0,
                           moreDueThisWeekCount: 2, totalCount: 6, streak: 7, onTimePct: 92)
    )
}

#Preview(as: .systemMedium) {
    widget()
} timeline: {
    SimpleEntry(
        date: .now,
        tasks: [
            WidgetTask(id: "1", title: "Water the plants", color: "green", glyph: "plant",
                       nextDueDate: Date().timeIntervalSince1970 * 1000,
                       isDueToday: true, isOverdue: false, isCompletedToday: false, details: nil),
            WidgetTask(id: "2", title: "Take out the trash", color: "slate", glyph: "trash",
                       nextDueDate: (Date().timeIntervalSince1970 + 2 * 86400) * 1000,
                       isDueToday: false, isOverdue: false, isCompletedToday: false, details: nil),
            WidgetTask(id: "3", title: "Refill vitamins", color: "orange", glyph: "pill",
                       nextDueDate: (Date().timeIntervalSince1970 + 4 * 86400) * 1000,
                       isDueToday: false, isOverdue: false, isCompletedToday: false, details: nil),
        ],
        stats: WidgetStats(overdueCount: 0, todayCount: 1, doneTodayCount: 0,
                           moreDueThisWeekCount: 2, totalCount: 8, streak: 7, onTimePct: 92)
    )
}

#Preview(as: .systemLarge) {
    widget()
} timeline: {
    SimpleEntry(
        date: .now,
        tasks: [
            WidgetTask(id: "0", title: "Replace toothbrush head", color: "plum", glyph: "pill",
                       nextDueDate: (Date().timeIntervalSince1970 - 5 * 86400) * 1000,
                       isDueToday: false, isOverdue: true, isCompletedToday: false, details: nil),
            WidgetTask(id: "1", title: "Water the plants", color: "green", glyph: "plant",
                       nextDueDate: Date().timeIntervalSince1970 * 1000,
                       isDueToday: true, isOverdue: false, isCompletedToday: false, details: nil),
            WidgetTask(id: "2", title: "Take out recycling", color: "brown", glyph: "trash",
                       nextDueDate: (Date().timeIntervalSince1970 + 86400) * 1000,
                       isDueToday: false, isOverdue: false, isCompletedToday: false, details: nil),
            WidgetTask(id: "3", title: "Car wash", color: "teal", glyph: "car",
                       nextDueDate: (Date().timeIntervalSince1970 + 2 * 86400) * 1000,
                       isDueToday: false, isOverdue: false, isCompletedToday: false, details: nil),
            WidgetTask(id: "4", title: "Change bedsheets", color: "purple", glyph: "bed",
                       nextDueDate: (Date().timeIntervalSince1970 + 5 * 86400) * 1000,
                       isDueToday: false, isOverdue: false, isCompletedToday: false, details: nil),
            WidgetTask(id: "5", title: "Pay rent", color: "orange", glyph: "wallet",
                       nextDueDate: (Date().timeIntervalSince1970 + 7 * 86400) * 1000,
                       isDueToday: false, isOverdue: false, isCompletedToday: false, details: nil),
        ],
        stats: WidgetStats(overdueCount: 1, todayCount: 1, doneTodayCount: 0,
                           moreDueThisWeekCount: 3, totalCount: 8, streak: 7, onTimePct: 92)
    )
}
