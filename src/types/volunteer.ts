export interface VolunteerActivity {
  volunteerId: number
  name: string
  description: string
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
