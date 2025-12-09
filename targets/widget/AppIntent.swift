import WidgetKit
import AppIntents

struct ConfigurationAppIntent: WidgetConfigurationIntent {
    static var title: LocalizedStringResource { "Configuration" }
    static var description: IntentDescription { "Cadence Widget Configuration" }

    @Parameter(title: "Show Distance in Words", default: false)
    var showDistanceInWords: Bool
}
