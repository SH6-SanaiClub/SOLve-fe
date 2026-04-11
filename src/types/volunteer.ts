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
}

export interface VolunteerListResponse {
  volunteers: VolunteerActivity[]
}
