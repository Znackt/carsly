import { AnalyticsData } from '../../lib/types';

export const mockAnalyticsData: AnalyticsData = {
  trends: [
    {
      id: 'bookings',
      title: 'Booking Trends',
      mainStat: '+15%',
      subStat: '+15%',
      isPositive: true,
      type: 'line',
      // High-res data for the smooth wave effect; labels are only on specific days
      chartData: [
        { name: 'pt1', value: 30, label: 'Mon' },
        { name: 'pt2', value: 65, label: '' },
        { name: 'pt3', value: 55, label: '' },
        { name: 'pt4', value: 25, label: 'Tue' },
        { name: 'pt5', value: 60, label: '' },
        { name: 'pt6', value: 25, label: '' },
        { name: 'pt7', value: 45, label: 'Wed' },
        { name: 'pt8', value: 50, label: '' },
        { name: 'pt9', value: 15, label: '' },
        { name: 'pt10', value: 75, label: 'Thu' },
        { name: 'pt11', value: 35, label: '' },
        { name: 'pt12', value: 20, label: '' },
        { name: 'pt13', value: 65, label: 'Fri' },
        { name: 'pt14', value: 45, label: '' },
        { name: 'pt15', value: 80, label: '' },
        { name: 'pt16', value: 15, label: 'Sat' },
        { name: 'pt17', value: 25, label: '' },
        { name: 'pt18', value: 85, label: '' },
        { name: 'pt19', value: 60, label: 'Sun' },
      ],
    },
    {
      id: 'revenue',
      title: 'Revenue Trends',
      mainStat: '+8%',
      subStat: '+8%',
      isPositive: true,
      type: 'bar',
      // Standard 7-day data for the bar chart
      chartData: [
        { name: 'mon', value: 80, label: 'Mon' },
        { name: 'tue', value: 65, label: 'Tue' },
        { name: 'wed', value: 90, label: 'Wed' },
        { name: 'thu', value: 75, label: 'Thu' },
        { name: 'fri', value: 100, label: 'Fri' },
        { name: 'sat', value: 85, label: 'Sat' },
        { name: 'sun', value: 50, label: 'Sun' },
      ],
    }
  ],
};