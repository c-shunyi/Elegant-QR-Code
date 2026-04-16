import type {
  CornerDotType,
  CornerSquareType,
  DotType,
  Preset
} from '../types'

export const dotTypes: DotType[] = [
  'square',
  'dots',
  'rounded',
  'classy',
  'classy-rounded',
  'extra-rounded'
]

export const cornerSquareTypes: CornerSquareType[] = [
  'square',
  'dot',
  'extra-rounded'
]

export const cornerDotTypes: CornerDotType[] = ['square', 'dot']

export const presets: Preset[] = [
  {
    name: '极光紫',
    dotColor: '#6d28d9',
    gradientColor: '#ec4899',
    bgColor: '#ffffff',
    dotType: 'rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot'
  },
  {
    name: '海洋蓝',
    dotColor: '#0ea5e9',
    gradientColor: '#14b8a6',
    bgColor: '#ffffff',
    dotType: 'classy-rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot'
  },
  {
    name: '日落橙',
    dotColor: '#f59e0b',
    gradientColor: '#ef4444',
    bgColor: '#fff7ed',
    dotType: 'dots',
    cornerSquareType: 'dot',
    cornerDotType: 'dot'
  },
  {
    name: '经典黑',
    dotColor: '#111827',
    gradientColor: '#111827',
    bgColor: '#ffffff',
    dotType: 'square',
    cornerSquareType: 'square',
    cornerDotType: 'square'
  },
  {
    name: '森林绿',
    dotColor: '#059669',
    gradientColor: '#84cc16',
    bgColor: '#f0fdf4',
    dotType: 'extra-rounded',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot'
  }
]
