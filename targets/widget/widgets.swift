import WidgetKit
import SwiftUI

struct PriorityTask: Codable {
    let id: String
    let title: String
    let nextDueDate: Double
    let details: String?
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

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if let task = entry.task {
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
                        .lineLimit(2)
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
            details: "Task details"
        )
    )
    SimpleEntry(date: .now, configuration: .starEyes, task: nil)
}
