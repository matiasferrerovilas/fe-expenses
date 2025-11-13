export interface UserGroup {
  id: number;
  description: string;
}

export interface GroupWithUsersrs {
  id: number;
  description: string;
  memberCount: number;
}

export interface CreateGroupForm {
  description: string;
}

export interface CreateInvitationForm {
  emails: string[];
  group: UserGroup;
}

export interface Invitations {
  id: number;
  group: UserGroup;
}

export interface ConfirmInvitations {
  status: boolean;
  id: number;
}
