export interface IUser {
  _id: string;
  createdAt: string;
  services: Services;
  emails: Email2[];
  type: string;
  status: string;
  active: boolean;
  _updatedAt: string;
  roles: string[];
  name: string;
  lastLogin: string;
  statusConnection: string;
  utcOffset: number;
  customFields: IUserCustomFields;
  username: string;
  nickname: string;
}

export interface IUserCustomFields {
  brokerId: string;
  phone: string;
  account_name: string;
  email: string;
  phone: string;
  broker: string;
  account_no: string;
  account_type_trading: string;
  broker: string;
}

interface Email2 {
  address: string;
  verified: boolean;
}

interface Services {
  password: Password;
  email: Email;
  resume: Resume;
}

interface Resume {
  loginTokens: LoginToken[];
}

interface LoginToken {
  when: string;
  hashedToken: string;
}

interface Email {
  verificationTokens: VerificationToken[];
}

interface VerificationToken {
  token: string;
  address: string;
  when: string;
}

interface Password {
  bcrypt: string;
}
