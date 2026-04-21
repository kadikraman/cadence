import SwiftUI

struct TaskTint {
    let accent: Color
    let tintLight: Color
    let tintDark: Color
}

private func hex(_ value: UInt32, _ alpha: Double = 1.0) -> Color {
    let r = Double((value >> 16) & 0xFF) / 255.0
    let g = Double((value >> 8) & 0xFF) / 255.0
    let b = Double(value & 0xFF) / 255.0
    return Color(.sRGB, red: r, green: g, blue: b, opacity: alpha)
}

private func slateTint() -> TaskTint {
    TaskTint(accent: hex(0x4E5A6C), tintLight: hex(0xDEE4EA), tintDark: hex(0x64748B, 0.26))
}

func taskTint(forColor key: String) -> TaskTint {
    switch key {
    case "purple":
        return TaskTint(accent: hex(0xAF52DE), tintLight: hex(0xF4EAFF), tintDark: hex(0xAF52DE, 0.20))
    case "lavender":
        return TaskTint(accent: hex(0xB085E0), tintLight: hex(0xF0E7FB), tintDark: hex(0xBF9BED, 0.22))
    case "plum":
        return TaskTint(accent: hex(0x7B4B6B), tintLight: hex(0xEADFE6), tintDark: hex(0x7B4B6B, 0.24))
    case "orange":
        return TaskTint(accent: hex(0xFF9500), tintLight: hex(0xFFEFD9), tintDark: hex(0xFF9F0A, 0.20))
    case "peach":
        return TaskTint(accent: hex(0xE8915A), tintLight: hex(0xFFE6D4), tintDark: hex(0xFFAF78, 0.25))
    case "amber":
        return TaskTint(accent: hex(0xD9A24C), tintLight: hex(0xFAE8C6), tintDark: hex(0xD9A24C, 0.22))
    case "clay":
        return TaskTint(accent: hex(0xB5765C), tintLight: hex(0xF1DDCF), tintDark: hex(0xB5765C, 0.24))
    case "yellow":
        return TaskTint(accent: hex(0xFFCC00), tintLight: hex(0xFFF6D1), tintDark: hex(0xFFD60A, 0.20))
    case "olive":
        return TaskTint(accent: hex(0x8E9C4A), tintLight: hex(0xEDEFC8), tintDark: hex(0xA8B660, 0.24))
    case "moss":
        return TaskTint(accent: hex(0x6F7A3D), tintLight: hex(0xDFE3CA), tintDark: hex(0x6F7A3D, 0.26))
    case "green":
        return TaskTint(accent: hex(0x34C759), tintLight: hex(0xDCF5E3), tintDark: hex(0x30D158, 0.20))
    case "forest":
        return TaskTint(accent: hex(0x2E6A42), tintLight: hex(0xD4E6D8), tintDark: hex(0x387F50, 0.24))
    case "sage":
        return TaskTint(accent: hex(0x8BA889), tintLight: hex(0xE2EAE1), tintDark: hex(0x8BA889, 0.24))
    case "teal":
        return TaskTint(accent: hex(0x30B0C7), tintLight: hex(0xD6F0F2), tintDark: hex(0x40C8E0, 0.20))
    case "mint":
        return TaskTint(accent: hex(0x00C7BE), tintLight: hex(0xD1F5EB), tintDark: hex(0x00C7BE, 0.20))
    case "brown":
        return TaskTint(accent: hex(0xAC8E68), tintLight: hex(0xEEE5DB), tintDark: hex(0xAC8E68, 0.22))
    case "stone":
        return TaskTint(accent: hex(0x9A9187), tintLight: hex(0xE9E5E0), tintDark: hex(0x9A9187, 0.24))
    case "dune":
        return TaskTint(accent: hex(0xC9B28C), tintLight: hex(0xF1E9D8), tintDark: hex(0xC9B28C, 0.26))
    case "slate":
        return slateTint()
    case "gray":
        return TaskTint(accent: hex(0x8E8E93), tintLight: hex(0xEBEBEF), tintDark: hex(0x8E8E93, 0.22))
    default:
        // Legacy / removed colors (blue, cyan, indigo, pink, rose, red, maroon) fall back to slate.
        return slateTint()
    }
}
