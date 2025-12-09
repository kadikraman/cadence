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
        switch family {
        case .systemSmall:
            smallWidgetView
        case .systemMedium:
            mediumWidgetView
        case .systemLarge:
            largeWidgetView
        default:
            smallWidgetView
        }
    }
    
    private func getDisplayTask(from tasks: [PriorityTask]) -> PriorityTask? {
        let overdueTasks = tasks.filter { isOverdue($0.nextDueDate) }
        let dueTodayTasks = tasks.filter { isDueToday($0.nextDueDate) }
        
        if !overdueTasks.isEmpty {
            return overdueTasks.first
        } else if !dueTodayTasks.isEmpty {
            return dueTodayTasks.first
        } else {
            return tasks.first
        }
    }
    
    private func getRemainingTasksInfo(from tasks: [PriorityTask], displayTask: PriorityTask) -> (count: Int, status: String)? {
        let overdueTasks = tasks.filter { isOverdue($0.nextDueDate) }
        let dueTodayTasks = tasks.filter { isDueToday($0.nextDueDate) }
        let otherTasks = tasks.filter { !isOverdue($0.nextDueDate) && !isDueToday($0.nextDueDate) }
        
        let isDisplayTaskOverdue = isOverdue(displayTask.nextDueDate)
        let isDisplayTaskDueToday = isDueToday(displayTask.nextDueDate)
        
        let remainingOverdue = overdueTasks.filter { $0.id != displayTask.id }
        let remainingDueToday = dueTodayTasks.filter { $0.id != displayTask.id }
        let remainingOther = otherTasks.filter { $0.id != displayTask.id }
        
        if isDisplayTaskOverdue {
            if !remainingOverdue.isEmpty {
                return (remainingOverdue.count, "overdue")
            } else if !remainingDueToday.isEmpty {
                return (remainingDueToday.count, "due today")
            } else if !remainingOther.isEmpty {
                return (remainingOther.count, "upcoming")
            }
        } else if isDisplayTaskDueToday {
            if !remainingDueToday.isEmpty {
                return (remainingDueToday.count, "due today")
            } else if !remainingOther.isEmpty {
                return (remainingOther.count, "upcoming")
            }
        } else {
            if !remainingOther.isEmpty {
                return (remainingOther.count, "upcoming")
            }
        }
        
        return nil
    }
    
    private var smallWidgetView: some View {
        VStack(alignment: .leading, spacing: 3) {
            if let tasks = loadMultipleTasks(), !tasks.isEmpty, let displayTask = getDisplayTask(from: tasks) {
                let isTaskDueYesterday = isDueYesterday(displayTask.nextDueDate)
                Text(displayTask.title)
                    .font(.headline)
                    .foregroundColor(.primary)
                    .lineLimit(2)
                
                Text(formatDueDate(displayTask.nextDueDate, configuration: entry.configuration))
                    .font(.caption)
                    .foregroundColor(isTaskDueYesterday ? .red : .secondary)
                
                if let remainingInfo = getRemainingTasksInfo(from: tasks, displayTask: displayTask) {
                    Text("+\(remainingInfo.count) more \(remainingInfo.status)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .padding(.top, 2)
                }
            } else if let task = entry.task {
                let isTaskDueYesterday = isDueYesterday(task.nextDueDate)
                Text(task.title)
                    .font(.headline)
                    .foregroundColor(.primary)
                    .lineLimit(2)
                
                Text(formatDueDate(task.nextDueDate, configuration: entry.configuration))
                    .font(.caption)
                    .foregroundColor(isTaskDueYesterday ? .red : .secondary)
            } else {
                Text("No tasks")
                    .font(.headline)
                    .foregroundColor(.secondary)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .padding()
    }
    
    private var mediumWidgetView: some View {
        VStack(alignment: .leading, spacing: 8) {
            if let tasks = loadMultipleTasks(), !tasks.isEmpty {
                let overdueTasks = tasks.filter { isOverdue($0.nextDueDate) }
                let dueTodayTasks = tasks.filter { isDueToday($0.nextDueDate) }
                let otherTasks = tasks.filter { !isOverdue($0.nextDueDate) && !isDueToday($0.nextDueDate) }
                
                let prioritizedTasks = overdueTasks + dueTodayTasks + otherTasks
                let maxTasks = 2
                let displayTasks = Array(prioritizedTasks.prefix(maxTasks))
                let remainingCount = max(0, prioritizedTasks.count - maxTasks)
                
                ForEach(displayTasks, id: \.id) { task in
                    let isTaskDueYesterday = isDueYesterday(task.nextDueDate)
                    VStack(alignment: .leading, spacing: 4) {
                        Text(task.title)
                            .font(.headline)
                            .foregroundColor(.primary)
                            .lineLimit(1)
                        
                        HStack {
                            Text(formatDueDate(task.nextDueDate, configuration: entry.configuration))
                                .font(.caption)
                                .foregroundColor(isTaskDueYesterday ? .red : .secondary)
                            
                            if let details = task.details, !details.isEmpty {
                                Text("•")
                                    .font(.caption)
                                    .foregroundColor(isTaskDueYesterday ? .red : .secondary)
                                Text(details)
                                    .font(.caption)
                                    .foregroundColor(isTaskDueYesterday ? .red : .secondary)
                                    .lineLimit(1)
                            }
                        }
                    }
                    
                    if task.id != displayTasks.last?.id {
                        Divider()
                            .padding(.vertical, 2)
                    }
                }
                
                if remainingCount > 0 {
                    Text("+\(remainingCount) more")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .padding(.top, 2)
                }
            } else if let task = entry.task {
                let isTaskDueYesterday = isDueYesterday(task.nextDueDate)
                Text(task.title)
                    .font(.headline)
                    .foregroundColor(.primary)
                    .lineLimit(2)
                
                Text(formatDueDate(task.nextDueDate, configuration: entry.configuration))
                    .font(.subheadline)
                    .foregroundColor(isTaskDueYesterday ? .red : .secondary)
                
                if let details = task.details, !details.isEmpty {
                    Text(details)
                        .font(.caption)
                        .foregroundColor(isTaskDueYesterday ? .red : .secondary)
                        .lineLimit(3)
                }
            } else {
                Text("No tasks")
                    .font(.headline)
                    .foregroundColor(.secondary)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .padding()
    }
    
    private var largeWidgetView: some View {
        VStack(alignment: .leading, spacing: 12) {
            if let tasks = loadMultipleTasks(), !tasks.isEmpty {
                let (displayTasks, remainingCount) = calculateLargeWidgetTasks(tasks: tasks)
                
                ForEach(displayTasks, id: \.id) { task in
                    let isTaskDueYesterday = isDueYesterday(task.nextDueDate)
                    VStack(alignment: .leading, spacing: 4) {
                        Text(task.title)
                            .font(.headline)
                            .foregroundColor(.primary)
                            .lineLimit(1)
                        
                        HStack {
                            Text(formatDueDate(task.nextDueDate, configuration: entry.configuration))
                                .font(.caption)
                                .foregroundColor(isTaskDueYesterday ? .red : .secondary)
                            
                            if let details = task.details, !details.isEmpty {
                                Text("•")
                                    .font(.caption)
                                    .foregroundColor(isTaskDueYesterday ? .red : .secondary)
                                Text(details)
                                    .font(.caption)
                                    .foregroundColor(isTaskDueYesterday ? .red : .secondary)
                                    .lineLimit(1)
                            }
                        }
                    }
                    .padding(.bottom, 4)
                    
                    if task.id != displayTasks.last?.id {
                        Divider()
                    }
                }
                
                if remainingCount > 0 {
                    Text("+\(remainingCount) more")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .padding(.top, 4)
                }
            } else if let task = entry.task {
                let isTaskDueYesterday = isDueYesterday(task.nextDueDate)
                VStack(alignment: .leading, spacing: 8) {
                    Text(task.title)
                        .font(.title3)
                        .fontWeight(.semibold)
                        .foregroundColor(.primary)
                        .lineLimit(2)
                    
                    Text(formatDueDate(task.nextDueDate, configuration: entry.configuration))
                        .font(.subheadline)
                        .foregroundColor(isTaskDueYesterday ? .red : .secondary)
                    
                    if let details = task.details, !details.isEmpty {
                        Text(details)
                            .font(.body)
                            .foregroundColor(.secondary)
                            .lineLimit(4)
                    }
                }
            } else {
                Text("No tasks")
                    .font(.headline)
                    .foregroundColor(.secondary)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .padding()
    }
    
    func calculateLargeWidgetTasks(tasks: [PriorityTask]) -> ([PriorityTask], Int) {
        let overdueTasks = tasks.filter { isOverdue($0.nextDueDate) }
        let dueTodayTasks = tasks.filter { isDueToday($0.nextDueDate) }
        let otherTasks = tasks.filter { !isOverdue($0.nextDueDate) && !isDueToday($0.nextDueDate) }
        
        let prioritizedTasks = overdueTasks + dueTodayTasks + otherTasks
        let maxTasks = 5
        let displayTasks = Array(prioritizedTasks.prefix(maxTasks))
        let remainingCount = max(0, prioritizedTasks.count - maxTasks)
        
        return (displayTasks, remainingCount)
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
    
    func isDueYesterday(_ timestamp: Double) -> Bool {
        let dueDate = Date(timeIntervalSince1970: timestamp / 1000.0)
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        let due = calendar.startOfDay(for: dueDate)
        let daysDiff = calendar.dateComponents([.day], from: today, to: due).day ?? 0
        return daysDiff == -1
    }
    
    func formatDueDate(_ timestamp: Double, configuration: ConfigurationAppIntent) -> String {
        let dueDate = Date(timeIntervalSince1970: timestamp / 1000.0)
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        let due = calendar.startOfDay(for: dueDate)
        
        let daysDiff = calendar.dateComponents([.day], from: today, to: due).day ?? 0
        
        if daysDiff == -1 {
            return "Due yesterday"
        } else if daysDiff == 0 {
            return "Due today"
        } else if daysDiff == 1 {
            return "Due tomorrow"
        } else if daysDiff < 0 {
            let overdueDays = abs(daysDiff)
            return "\(overdueDays) day\(overdueDays == 1 ? "" : "s") overdue"
        } else {
            if configuration.showDistanceInWords {
                return "Due in \(daysDiff) day\(daysDiff == 1 ? "" : "s")"
            } else {
                let formatter = DateFormatter()
                formatter.dateFormat = "MMM d"
                return "Due \(formatter.string(from: dueDate))"
            }
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
