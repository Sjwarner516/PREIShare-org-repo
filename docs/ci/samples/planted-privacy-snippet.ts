/**
 * Teaching fixture only.
 * This file is not part of the TanStack app.
 * Do not import it from application code.
 * Contact values below are fake. They are not a real member.
 */

export type MemberContact = {
  displayName: string
  email: string
  phone: string
}

export type PublicSharePreview = {
  title: string
  summary: string
  memberEmail: string
  memberPhone: string
}

export function buildPublicSharePreview(member: MemberContact): PublicSharePreview {
  return {
    title: 'PREIshare public preview',
    summary: member.displayName + ' shared an update',
    memberEmail: member.email,
    memberPhone: member.phone,
  }
}

export const sampleMember: MemberContact = {
  displayName: 'Sample Member',
  email: 'example@example.com',
  phone: '+1-555-010-0199',
}
