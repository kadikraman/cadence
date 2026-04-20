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

func taskTint(forColor key: String) -> TaskTint {
    switch key {
    case "blue":
        return TaskTint(accent: hex(0x0A84FF), tintLight: hex(0xE8F1FF), tintDark: hex(0x0A84FF, 0.18))
    case "cyan":
        return TaskTint(accent: hex(0x32ADE6), tintLight: hex(0xDCF1FF), tintDark: hex(0x32ADE6, 0.22))
    case "indigo":
        return TaskTint(accent: hex(0x5E5CE6), tintLight: hex(0xECEBFF), tintDark: hex(0x5E5CE6, 0.20))
    case "purple":
        return TaskTint(accent: hex(0xAF52DE), tintLight: hex(0xF4EAFF), tintDark: hex(0xAF52DE, 0.20))
    case "lavender":
        return TaskTint(accent: hex(0xB085E0), tintLight: hex(0xF0E7FB), tintDark: hex(0xBF9BED, 0.22))
    case "pink":
        return TaskTint(accent: hex(0xFF375F), tintLight: hex(0xFFE9EF), tintDark: hex(0xFF375F, 0.18))
    case "rose":
        return TaskTint(accent: hex(0xE64D6A), tintLight: hex(0xFFE0E4), tintDark: hex(0xFF637D, 0.22))
    case "orange":
        return TaskTint(accent: hex(0xFF9500), tintLight: hex(0xFFEFD9), tintDark: hex(0xFF9F0A, 0.20))
    case "peach":
        return TaskTint(accent: hex(0xE8915A), tintLight: hex(0xFFE6D4), tintDark: hex(0xFFAF78, 0.25))
    case "yellow":
        return TaskTint(accent: hex(0xFFCC00), tintLight: hex(0xFFF6D1), tintDark: hex(0xFFD60A, 0.20))
    case "olive":
        return TaskTint(accent: hex(0x8E9C4A), tintLight: hex(0xEDEFC8), tintDark: hex(0xA8B660, 0.24))
    case "green":
        return TaskTint(accent: hex(0x34C759), tintLight: hex(0xDCF5E3), tintDark: hex(0x30D158, 0.20))
    case "forest":
        return TaskTint(accent: hex(0x2E6A42), tintLight: hex(0xD4E6D8), tintDark: hex(0x387F50, 0.24))
    case "teal":
        return TaskTint(accent: hex(0x30B0C7), tintLight: hex(0xD6F0F2), tintDark: hex(0x40C8E0, 0.20))
    case "mint":
        return TaskTint(accent: hex(0x00C7BE), tintLight: hex(0xD1F5EB), tintDark: hex(0x00C7BE, 0.20))
    case "red":
        return TaskTint(accent: hex(0xFF3B30), tintLight: hex(0xFFE5E5), tintDark: hex(0xFF453A, 0.20))
    case "maroon":
        return TaskTint(accent: hex(0x8A2A32), tintLight: hex(0xF3D9D7), tintDark: hex(0x9B323C, 0.25))
    case "brown":
        return TaskTint(accent: hex(0xAC8E68), tintLight: hex(0xEEE5DB), tintDark: hex(0xAC8E68, 0.22))
    case "slate":
        return TaskTint(accent: hex(0x4E5A6C), tintLight: hex(0xDEE4EA), tintDark: hex(0x64748B, 0.26))
    case "gray":
        return TaskTint(accent: hex(0x8E8E93), tintLight: hex(0xEBEBEF), tintDark: hex(0x8E8E93, 0.22))
    default:
        return TaskTint(accent: hex(0x8E8E93), tintLight: hex(0xEBEBEF), tintDark: hex(0x8E8E93, 0.22))
    }
}
