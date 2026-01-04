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
    
    private func formatDueDate(_ timestamp: Double, inWords: Bool) -> String {
        let dueDate = Date(timeIntervalSince1970: timestamp / 1000.0)
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        let due = calendar.startOfDay(for: dueDate)
        let daysDiff = calendar.dateComponents([.day], from: today, to: due).day ?? 0
        
        if inWords {
            if daysDiff == 0 {
                return "Today"
            } else if daysDiff == 1 {
                return "Tomorrow"
            } else {
                return "in \(daysDiff) days"
            }
        } else {
            let formatter = DateFormatter()
            formatter.dateFormat = "MMM d"
            return formatter.string(from: dueDate)
        }
    }
    
    private var widgetContentView: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Cadence")
                    .font(.headline)
                    .foregroundColor(.blue)
                Spacer()
                if let tasks = loadMultipleTasks() {
                    let stats = getTaskStats(from: tasks)
                    let count = stats.overdueTasks.count + stats.dueTodayTasks.count
                    Text("\(count)")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.primary)
                } else {
                    Text("0")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.primary)
                }
            }
            
            if let tasks = loadMultipleTasks(), !tasks.isEmpty {
                let stats = getTaskStats(from: tasks)
                
                if !stats.overdueTasks.isEmpty || !stats.dueTodayTasks.isEmpty {
                    let allTasks = stats.overdueTasks + stats.dueTodayTasks
                    let firstThreeTasks = Array(allTasks.prefix(3))
                    
                    VStack(alignment: .leading, spacing: 8) {
                        ForEach(Array(firstThreeTasks.enumerated()), id: \.element.id) { index, task in
                            let taskIsOverdue = isOverdue(task.nextDueDate)
                            let lineLimit: Int = firstThreeTasks.count == 1 ? 4 : (firstThreeTasks.count == 2 ? 2 : 1)
                            
                            HStack(alignment: .center, spacing: 2) {
                                Text(task.title)
                                    .font(.subheadline)
                                    .foregroundColor(.primary)
                                    .lineLimit(lineLimit)
                                Spacer()
                                Circle()
                                    .stroke(taskIsOverdue ? Color.red : Color.blue, lineWidth: 2)
                                    .frame(width: 16, height: 16)
                            }
                            
                            if index < firstThreeTasks.count - 1 {
                                Rectangle()
                                    .fill(Color.clear)
                                    .frame(height: 1)
                                    .overlay(
                                        Rectangle()
                                            .stroke(style: StrokeStyle(lineWidth: 1, dash: [2, 2]))
                                            .foregroundColor(Color.gray.opacity(0.4))
                                    )
                            }
                        }
                    }
                } else if let nextTask = stats.nextTask {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Next up")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Text(nextTask.title)
                            .font(.subheadline)
                            .foregroundColor(.primary)
                            .lineLimit(3)
                        Text(formatDueDate(nextTask.nextDueDate, inWords: entry.configuration.showDistanceInWords))
                            .font(.caption2)
                            .foregroundColor(.secondary.opacity(0.7))
                    }
                }
            } else {
                Text("no tasks")
                    .font(.subheadline)
                    .foregroundColor(.primary)
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
