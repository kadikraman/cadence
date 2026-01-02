import WidgetKit
import SwiftUI

struct PriorityTask: Codable {
    let id: String
    let title: String
    let nextDueDate: Double
    let details: String?
    let isDueToday: Bool?
}

struct Provider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), configuration: ConfigurationAppIntent(), task: nil)
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
        let task = loadPriorityTask()
        return SimpleEntry(date: Date(), configuration: configuration, task: task)
    }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
        let task = loadPriorityTask()
        let entry = SimpleEntry(date: Date(), configuration: configuration, task: task)
        
        let nextUpdate = Calendar.current.date(byAdding: .hour, value: 1, to: Date())!
        return Timeline(entries: [entry], policy: .after(nextUpdate))
    }
    
    func loadPriorityTask() -> PriorityTask? {
        guard let defaults = UserDefaults(suiteName: "group.dev.kadi.cadence") else {
            return nil
        }
        
        guard let taskJsonString = defaults.string(forKey: "widget_priority_task"),
              taskJsonString != "null",
              let taskData = taskJsonString.data(using: .utf8) else {
            return nil
        }
        
        let decoder = JSONDecoder()
        return try? decoder.decode(PriorityTask.self, from: taskData)
    }

}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let configuration: ConfigurationAppIntent
    let task: PriorityTask?
}

struct widgetEntryView : View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        widgetContentView
    }
    
    private func getTaskStats(from tasks: [PriorityTask]) -> (overdueTasks: [PriorityTask], dueTodayTasks: [PriorityTask], nextTask: PriorityTask?) {
        let overdueTasks = tasks.filter { isOverdue($0.nextDueDate) }
        let dueTodayTasks = tasks.filter { isDueToday($0.nextDueDate) }
        let upcomingTasks = tasks.filter { !isOverdue($0.nextDueDate) && !isDueToday($0.nextDueDate) }
        
        let nextTask = upcomingTasks.sorted { $0.nextDueDate < $1.nextDueDate }.first
        
        return (overdueTasks, dueTodayTasks, nextTask)
    }
    
    private func getDaysUntil(_ timestamp: Double) -> Int {
        let dueDate = Date(timeIntervalSince1970: timestamp / 1000.0)
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        let due = calendar.startOfDay(for: dueDate)
        let daysDiff = calendar.dateComponents([.day], from: today, to: due).day ?? 0
        return max(0, daysDiff)
    }
    
    private var widgetContentView: some View {
        VStack(alignment: .leading, spacing: 16) {
            if let tasks = loadMultipleTasks(), !tasks.isEmpty {
                let stats = getTaskStats(from: tasks)
                
                if !stats.overdueTasks.isEmpty {
                    VStack(alignment: .leading, spacing: 4) {
                        HStack(spacing: 6) {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .font(.caption)
                                .foregroundColor(.red)
                            Text("Overdue (\(stats.overdueTasks.count))")
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .foregroundColor(.red)
                        }
                        ForEach(Array(stats.overdueTasks.prefix(2)), id: \.id) { task in
                            Text("- \(task.title)")
                                .font(.caption)
                                .foregroundColor(.red)
                                .lineLimit(1)
                        }
                        if stats.overdueTasks.count > 2 {
                            Text("(+\(stats.overdueTasks.count - 2) more)")
                                .font(.caption)
                                .foregroundColor(.red.opacity(0.7))
                        }
                    }
                }
                
                if !stats.dueTodayTasks.isEmpty {
                    VStack(alignment: .leading, spacing: 4) {
                        HStack(spacing: 6) {
                            Image(systemName: "clock.fill")
                                .font(.caption)
                                .foregroundColor(.blue)
                            Text("Due today (\(stats.dueTodayTasks.count))")
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .foregroundColor(.blue)
                        }
                        ForEach(Array(stats.dueTodayTasks.prefix(2)), id: \.id) { task in
                            Text("- \(task.title)")
                                .font(.caption)
                                .foregroundColor(.blue)
                                .lineLimit(1)
                        }
                        if stats.dueTodayTasks.count > 2 {
                            Text("(+\(stats.dueTodayTasks.count - 2) more)")
                                .font(.caption)
                                .foregroundColor(.blue.opacity(0.7))
                        }
                    }
                }
                
                if stats.overdueTasks.isEmpty && stats.dueTodayTasks.isEmpty, let nextTask = stats.nextTask {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Next up:")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Text("\(nextTask.title)")
                            .font(.headline)
                            .foregroundColor(.primary)
                            .lineLimit(1)
                        let days = getDaysUntil(nextTask.nextDueDate)
                        Text("in \(days) day\(days == 1 ? "" : "s")")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
            } else {
                Text("No tasks")
                    .font(.headline)
                    .foregroundColor(.secondary)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .padding(.all, 4)
    }
    
    func loadMultipleTasks() -> [PriorityTask]? {
        guard let defaults = UserDefaults(suiteName: "group.dev.kadi.cadence"),
              let tasksJsonString = defaults.string(forKey: "widget_tasks"),
              tasksJsonString != "null",
              let taskData = tasksJsonString.data(using: .utf8) else {
            return nil
        }
        
        let decoder = JSONDecoder()
        return try? decoder.decode([PriorityTask].self, from: taskData)
    }
    
    func isDueToday(_ timestamp: Double) -> Bool {
        let dueDate = Date(timeIntervalSince1970: timestamp / 1000.0)
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        let due = calendar.startOfDay(for: dueDate)
        return calendar.dateComponents([.day], from: today, to: due).day == 0
    }
    
    func isOverdue(_ timestamp: Double) -> Bool {
        let dueDate = Date(timeIntervalSince1970: timestamp / 1000.0)
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        let due = calendar.startOfDay(for: dueDate)
        let daysDiff = calendar.dateComponents([.day], from: today, to: due).day ?? 0
        return daysDiff < 0
    }
    
}

struct widget: Widget {
    let kind: String = "widget"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
            widgetEntryView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

extension ConfigurationAppIntent {
    fileprivate static var defaultConfig: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.showDistanceInWords = false
        return intent
    }
    
    fileprivate static var wordsConfig: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.showDistanceInWords = true
        return intent
    }
}

#Preview(as: .systemSmall) {
    widget()
} timeline: {
    SimpleEntry(
        date: .now,
        configuration: .defaultConfig,
        task: PriorityTask(
            id: "1",
            title: "Example Task",
            nextDueDate: Date().timeIntervalSince1970 * 1000.0,
            details: "Task details",
            isDueToday: true
        )
    )
    SimpleEntry(date: .now, configuration: .wordsConfig, task: nil)
}

#Preview(as: .systemMedium) {
    widget()
} timeline: {
    SimpleEntry(
        date: .now,
        configuration: .defaultConfig,
        task: PriorityTask(
            id: "1",
            title: "Example Task with More Details",
            nextDueDate: Date().timeIntervalSince1970 * 1000.0,
            details: "This is a longer task description that shows more information in medium size widgets",
            isDueToday: true
        )
    )
}

#Preview(as: .systemLarge) {
    widget()
} timeline: {
    SimpleEntry(
        date: .now,
        configuration: .defaultConfig,
        task: PriorityTask(
            id: "1",
            title: "First Task",
            nextDueDate: Date().timeIntervalSince1970 * 1000.0,
            details: "Task details",
            isDueToday: true
        )
    )
}
