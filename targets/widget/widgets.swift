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

//    func relevances() async -> WidgetRelevances<ConfigurationAppIntent> {
//        // Generate a list containing the contexts this widget is relevant in.
//    }
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
    
    private var smallWidgetView: some View {
        VStack(alignment: .leading, spacing: 6) {
            if let tasks = loadMultipleTasks(), !tasks.isEmpty {
                let dueTodayTasks = tasks.filter { isDueToday($0.nextDueDate) }
                let displayTask = dueTodayTasks.isEmpty ? tasks.first : dueTodayTasks.first
                let remainingCount = dueTodayTasks.isEmpty ? max(0, tasks.count - 1) : max(0, dueTodayTasks.count - 1)
                
                if let task = displayTask {
                    Text(task.title)
                        .font(.headline)
                        .lineLimit(2)
                    
                    Text(formatDueDate(task.nextDueDate))
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
                    if remainingCount > 0 {
                        Text("+\(remainingCount) more")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
            } else if let task = entry.task {
                Text(task.title)
                    .font(.headline)
                    .lineLimit(2)
                
                Text(formatDueDate(task.nextDueDate))
                    .font(.subheadline)
                    .foregroundColor(.secondary)
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
                let dueTodayTasks = tasks.filter { isDueToday($0.nextDueDate) }
                let maxTasks = dueTodayTasks.isEmpty ? 2 : min(dueTodayTasks.count, 3)
                let displayTasks = dueTodayTasks.isEmpty ? Array(tasks.prefix(maxTasks)) : Array(dueTodayTasks.prefix(maxTasks))
                let remainingCount = dueTodayTasks.isEmpty ? max(0, tasks.count - maxTasks) : max(0, dueTodayTasks.count - maxTasks)
                
                ForEach(displayTasks, id: \.id) { task in
                    VStack(alignment: .leading, spacing: 4) {
                        Text(task.title)
                            .font(.headline)
                            .lineLimit(1)
                        
                        HStack {
                            Text(formatDueDate(task.nextDueDate))
                                .font(.caption)
                                .foregroundColor(.secondary)
                            
                            if let details = task.details, !details.isEmpty {
                                Text("•")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                Text(details)
                                    .font(.caption)
                                    .foregroundColor(.secondary)
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
                Text(task.title)
                    .font(.headline)
                    .lineLimit(2)
                
                Text(formatDueDate(task.nextDueDate))
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                if let details = task.details, !details.isEmpty {
                    Text(details)
                        .font(.caption)
                        .foregroundColor(.secondary)
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
                    VStack(alignment: .leading, spacing: 4) {
                        Text(task.title)
                            .font(.headline)
                            .lineLimit(1)
                        
                        HStack {
                            Text(formatDueDate(task.nextDueDate))
                                .font(.caption)
                                .foregroundColor(.secondary)
                            
                            if let details = task.details, !details.isEmpty {
                                Text("•")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                Text(details)
                                    .font(.caption)
                                    .foregroundColor(.secondary)
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
                VStack(alignment: .leading, spacing: 8) {
                    Text(task.title)
                        .font(.title3)
                        .fontWeight(.semibold)
                        .lineLimit(2)
                    
                    Text(formatDueDate(task.nextDueDate))
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
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
        let dueTodayTasks = tasks.filter { isDueToday($0.nextDueDate) }
        let otherTasks = tasks.filter { !isDueToday($0.nextDueDate) }
        
        let maxTasks = 8
        var displayTasks: [PriorityTask] = []
        var remainingCount = 0
        
        if !dueTodayTasks.isEmpty {
            displayTasks = Array(dueTodayTasks.prefix(maxTasks))
            remainingCount = max(0, dueTodayTasks.count - maxTasks)
            if remainingCount == 0 && !otherTasks.isEmpty {
                let remainingSlots = maxTasks - displayTasks.count
                displayTasks.append(contentsOf: Array(otherTasks.prefix(remainingSlots)))
                remainingCount = max(0, otherTasks.count - remainingSlots)
            }
        } else {
            displayTasks = Array(tasks.prefix(maxTasks))
            remainingCount = max(0, tasks.count - maxTasks)
        }
        
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
    
    func formatDueDate(_ timestamp: Double) -> String {
        let dueDate = Date(timeIntervalSince1970: timestamp / 1000.0)
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        let due = calendar.startOfDay(for: dueDate)
        
        let daysDiff = calendar.dateComponents([.day], from: today, to: due).day ?? 0
        
        if daysDiff < 0 {
            let overdueDays = abs(daysDiff)
            return "\(overdueDays) day\(overdueDays == 1 ? "" : "s") overdue"
        } else if daysDiff == 0 {
            return "Due today"
        } else if daysDiff == 1 {
            return "Due tomorrow"
        } else {
            let formatter = DateFormatter()
            formatter.dateFormat = "MMM d"
            return "Due \(formatter.string(from: dueDate))"
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
    fileprivate static var smiley: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "😀"
        return intent
    }
    
    fileprivate static var starEyes: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "🤩"
        return intent
    }
}

#Preview(as: .systemSmall) {
    widget()
} timeline: {
    SimpleEntry(
        date: .now,
        configuration: .smiley,
        task: PriorityTask(
            id: "1",
            title: "Example Task",
            nextDueDate: Date().timeIntervalSince1970 * 1000.0,
            details: "Task details",
            isDueToday: true
        )
    )
    SimpleEntry(date: .now, configuration: .starEyes, task: nil)
}

#Preview(as: .systemMedium) {
    widget()
} timeline: {
    SimpleEntry(
        date: .now,
        configuration: .smiley,
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
        configuration: .smiley,
        task: PriorityTask(
            id: "1",
            title: "First Task",
            nextDueDate: Date().timeIntervalSince1970 * 1000.0,
            details: "Task details",
            isDueToday: true
        )
    )
}
