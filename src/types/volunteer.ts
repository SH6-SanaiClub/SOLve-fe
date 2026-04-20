export interface VolunteerActivity {
  volunteerId: number
  name: string
  description: string
  imageUrl: string
  activityDate: string
  location: string
  capacity: number
  currentEnrolled: number
  volunteerHour: number
  organization: string
  status: 'APPLIED' | null
}

export type VolunteerDetail = VolunteerActivity

export interface VolunteerListResponse {
  volunteers: VolunteerActivity[]
}

export interface VolunteerApplicationItem extends VolunteerActivity {
  volunteerApplicationId: number
}

export interface VolunteerApplicationListResponse {
  volunteers: VolunteerApplicationItem[]
}

export type VolunteerHistoryStatus =
  | 'NOSHOW'
  | 'APPLIED'
  | 'ATTENDED'
  | 'COMPLETED'
  | 'INCOMPLETE'

export interface VolunteerHistoryItem {
  volunteerApplicationId: number
  volunteerId: number
  organization: string
  name: string
  activityDate: string
  status: VolunteerHistoryStatus
  checkInAt: string | null
  checkOutAt: string | null
  recognizedVolunteerHour: number
  scheduledVolunteerHour: number
}

export interface VolunteerHistoryListResponse {
  volunteers: VolunteerHistoryItem[]
}

export interface ApplyVolunteerRequest {
  volunteerId: number
}

export interface VolunteerApplicationResponse {
  volunteerApplicationId: number
  volunteerId: number
  name: string
  location: string
  activityDate: string
  status: 'APPLIED'
}

export type VolunteerAttendanceStatus = 'APPLIED' | 'ATTENDED' | 'COMPLETED'

export interface VolunteerAttendanceInfo {
  userName: string
  volunteerId: number
  name: string
  location: string
  activityDate: string
  volunteerHour: number
  organization: string
  status: VolunteerAttendanceStatus
  checkInAt: string | null
  checkOutAt: string | null
}

export interface VolunteerCheckInRequest {
  qrToken: string
  latitude: number
  longitude: number
}

export interface VolunteerCheckInResponse {
  checkInAt: string
  status: 'ATTENDED'
}

export interface VolunteerCheckOutRequest {
  qrToken: string
  latitude: number
  longitude: number
}

export interface VolunteerCheckOutResponse {
  name: string
  checkInAt: string
  checkOutAt: string
  status: 'COMPLETED' | 'INCOMPLETE'
  awardedPoint: number
  currentPoint: number
}
