import SwiftUI

// Keep in sync with src/utils/taskTints.ts. Any new ColorKey added there must
// also be added here (with `accent`, `accentDark`, `tintLight`, `tintDark`),
// otherwise widget tasks will fall back to slate.

struct TaskTint {
    let accent: Color
    let accentDark: Color
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
    TaskTint(
        accent: hex(0x4E5A6C),
        accentDark: hex(0x94A3B8),
        tintLight: hex(0xDEE4EA),
        tintDark: hex(0x64748B, 0.26)
    )
}

func taskTint(forColor key: String) -> TaskTint {
    switch key {
    case "purple":
        return TaskTint(accent: hex(0xAF52DE), accentDark: hex(0xAF52DE), tintLight: hex(0xF4EAFF), tintDark: hex(0xAF52DE, 0.20))
    case "lavender":
        return TaskTint(accent: hex(0xB085E0), accentDark: hex(0xB085E0), tintLight: hex(0xF0E7FB), tintDark: hex(0xBF9BED, 0.22))
    case "plum":
        return TaskTint(accent: hex(0x7B4B6B), accentDark: hex(0xC28FA5), tintLight: hex(0xEADFE6), tintDark: hex(0x7B4B6B, 0.24))
    case "violet":
        return TaskTint(accent: hex(0x8E4EC6), accentDark: hex(0x8E4EC6), tintLight: hex(0xEBE0F7), tintDark: hex(0x8E4EC6, 0.22))
    case "magenta":
        return TaskTint(accent: hex(0xC13584), accentDark: hex(0xC13584), tintLight: hex(0xF8DDEC), tintDark: hex(0xC13584, 0.22))
    case "indigo":
        return TaskTint(accent: hex(0x5856D6), accentDark: hex(0x5856D6), tintLight: hex(0xE0E0F9), tintDark: hex(0x5856D6, 0.22))
    case "pink":
        return TaskTint(accent: hex(0xFF2D55), accentDark: hex(0xFF2D55), tintLight: hex(0xFFDCE4), tintDark: hex(0xFF2D55, 0.20))
    case "rose":
        return TaskTint(accent: hex(0xE29CB3), accentDark: hex(0xE29CB3), tintLight: hex(0xF7E3EB), tintDark: hex(0xE29CB3, 0.28))
    case "coral":
        return TaskTint(accent: hex(0xF97454), accentDark: hex(0xF97454), tintLight: hex(0xFFDED2), tintDark: hex(0xF97454, 0.22))
    case "red":
        return TaskTint(accent: hex(0xFF3B30), accentDark: hex(0xFF3B30), tintLight: hex(0xFFDAD6), tintDark: hex(0xFF3B30, 0.20))
    case "crimson":
        return TaskTint(accent: hex(0xB83A4B), accentDark: hex(0xE27484), tintLight: hex(0xEED0D3), tintDark: hex(0xB83A4B, 0.26))
    case "orange":
        return TaskTint(accent: hex(0xFF9500), accentDark: hex(0xFF9500), tintLight: hex(0xFFEFD9), tintDark: hex(0xFF9F0A, 0.20))
    case "peach":
        return TaskTint(accent: hex(0xE8915A), accentDark: hex(0xE8915A), tintLight: hex(0xFFE6D4), tintDark: hex(0xFFAF78, 0.25))
    case "amber":
        return TaskTint(accent: hex(0xD9A24C), accentDark: hex(0xD9A24C), tintLight: hex(0xFAE8C6), tintDark: hex(0xD9A24C, 0.22))
    case "clay":
        return TaskTint(accent: hex(0xB5765C), accentDark: hex(0xB5765C), tintLight: hex(0xF1DDCF), tintDark: hex(0xB5765C, 0.24))
    case "rust":
        return TaskTint(accent: hex(0xA8593C), accentDark: hex(0xD08568), tintLight: hex(0xEAD4CA), tintDark: hex(0xA8593C, 0.26))
    case "copper":
        return TaskTint(accent: hex(0xC17757), accentDark: hex(0xC17757), tintLight: hex(0xEFD9CC), tintDark: hex(0xC17757, 0.24))
    case "yellow":
        return TaskTint(accent: hex(0xFFCC00), accentDark: hex(0xFFCC00), tintLight: hex(0xFFF6D1), tintDark: hex(0xFFD60A, 0.20))
    case "gold":
        return TaskTint(accent: hex(0xD4A84B), accentDark: hex(0xD4A84B), tintLight: hex(0xF7EBC9), tintDark: hex(0xD4A84B, 0.22))
    case "olive":
        return TaskTint(accent: hex(0x8E9C4A), accentDark: hex(0xB6C470), tintLight: hex(0xEDEFC8), tintDark: hex(0xA8B660, 0.24))
    case "moss":
        return TaskTint(accent: hex(0x6F7A3D), accentDark: hex(0xA8B575), tintLight: hex(0xDFE3CA), tintDark: hex(0x6F7A3D, 0.26))
    case "lime":
        return TaskTint(accent: hex(0xA3BF3E), accentDark: hex(0xA3BF3E), tintLight: hex(0xEBF2C8), tintDark: hex(0xA3BF3E, 0.24))
    case "green":
        return TaskTint(accent: hex(0x34C759), accentDark: hex(0x34C759), tintLight: hex(0xDCF5E3), tintDark: hex(0x30D158, 0.20))
    case "forest":
        return TaskTint(accent: hex(0x2E6A42), accentDark: hex(0x6FAA81), tintLight: hex(0xD4E6D8), tintDark: hex(0x387F50, 0.24))
    case "sage":
        return TaskTint(accent: hex(0x8BA889), accentDark: hex(0x8BA889), tintLight: hex(0xE2EAE1), tintDark: hex(0x8BA889, 0.24))
    case "jade":
        return TaskTint(accent: hex(0x2E8B72), accentDark: hex(0x5FB89B), tintLight: hex(0xD1E8E0), tintDark: hex(0x2E8B72, 0.24))
    case "mint":
        return TaskTint(accent: hex(0x00C7BE), accentDark: hex(0x00C7BE), tintLight: hex(0xD1F5EB), tintDark: hex(0x00C7BE, 0.20))
    case "teal":
        return TaskTint(accent: hex(0x30B0C7), accentDark: hex(0x30B0C7), tintLight: hex(0xD6F0F2), tintDark: hex(0x40C8E0, 0.20))
    case "cyan":
        return TaskTint(accent: hex(0x22C4E4), accentDark: hex(0x22C4E4), tintLight: hex(0xCFEFF6), tintDark: hex(0x22C4E4, 0.22))
    case "sky":
        return TaskTint(accent: hex(0x5CB6E8), accentDark: hex(0x5CB6E8), tintLight: hex(0xD9ECF7), tintDark: hex(0x5CB6E8, 0.22))
    case "blue":
        return TaskTint(accent: hex(0x0A84FF), accentDark: hex(0x0A84FF), tintLight: hex(0xD6E6FB), tintDark: hex(0x0A84FF, 0.22))
    case "cobalt":
        return TaskTint(accent: hex(0x2955B5), accentDark: hex(0x6E91D6), tintLight: hex(0xD4DEEF), tintDark: hex(0x2955B5, 0.26))
    case "navy":
        return TaskTint(accent: hex(0x1F3A5F), accentDark: hex(0x7C95B8), tintLight: hex(0xD2D8E1), tintDark: hex(0x1F3A5F, 0.30))
    case "brown":
        return TaskTint(accent: hex(0xAC8E68), accentDark: hex(0xAC8E68), tintLight: hex(0xEEE5DB), tintDark: hex(0xAC8E68, 0.22))
    case "stone":
        return TaskTint(accent: hex(0x9A9187), accentDark: hex(0x9A9187), tintLight: hex(0xE9E5E0), tintDark: hex(0x9A9187, 0.24))
    case "dune":
        return TaskTint(accent: hex(0xC9B28C), accentDark: hex(0xC9B28C), tintLight: hex(0xF1E9D8), tintDark: hex(0xC9B28C, 0.26))
    case "slate":
        return slateTint()
    case "gray":
        return TaskTint(accent: hex(0x8E8E93), accentDark: hex(0x8E8E93), tintLight: hex(0xEBEBEF), tintDark: hex(0x8E8E93, 0.22))
    case "charcoal":
        return TaskTint(accent: hex(0x4A4A4F), accentDark: hex(0x989899), tintLight: hex(0xDCDCDF), tintDark: hex(0x4A4A4F, 0.32))
    case "ink":
        return TaskTint(accent: hex(0x2C2C30), accentDark: hex(0x8E8E94), tintLight: hex(0xD5D5D8), tintDark: hex(0x2C2C30, 0.34))
    default:
        return slateTint()
    }
}
