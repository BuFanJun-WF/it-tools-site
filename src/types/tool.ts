export type ToolCategory =
  | 'Crypto'
  | 'Converter'
  | 'Web'
  | 'Images & Videos'
  | 'Development'
  | 'Network'
  | 'Math'
  | 'Measurement'
  | 'Text'
  | 'Data'

export interface Tool {
  /** Stable identifier, also used as the route key (e.g. 'hash-text'). */
  id: string
  /** Route path, e.g. '/hash-text'. */
  path: string
  category: ToolCategory
  /** Icon key into the icon map. */
  icon: string
  /** Search keywords (mixed EN + ZH for bilingual search). */
  keywords: string[]
  /** i18n key for the localized name. */
  nameKey: string
  /** i18n key for the localized description. */
  descKey: string
  /** True if the tool has a Vue implementation registered; false shows "Coming soon". */
  implemented: boolean
}

export interface CategoryMeta {
  /** Icon key. */
  icon: string
  /** Accent color token (CSS var or hex). */
  color: string
  /** i18n key for the localized category label. */
  labelKey: string
}
