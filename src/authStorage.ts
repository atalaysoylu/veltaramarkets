const KEY_USERS = 'veltara-users'
const KEY_SESSION = 'veltara-session'

export type StoredUser = {
  id: string
  email: string
  fullName: string
  /** 11 haneli TCKN (yalnızca rakam) */
  tckn: string
  phone: string
  referredBy: string
  password: string
  /** Yer tutucu — çekim kilidi kullanılmıyorsa 0 */
  withdrawLockUntil: number
}

export type Session = {
  userId: string
  email: string
}

export type WithdrawalRequest = {
  id: string
  userId: string
  iban: string
  amountTry: number
  createdAt: number
}

export type DepositRequest = {
  id: string
  userId: string
  bankId: string
  bankName: string
  amountTry: number
  createdAt: number
}

const KEY_WITHDRAWALS = 'veltara-withdraw-requests'
const KEY_DEPOSITS = 'veltara-deposit-requests'
const KEY_DEPOSIT_DRAFT = 'veltara-deposit-draft'

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

/** localStorage'dan okunan kullanıcı (eski kayıtlarda bazı alanlar olmayabilir). */
type StoredUserPersisted = Omit<StoredUser, 'tckn' | 'phone' | 'referredBy'> & {
  tckn?: string
  phone?: string
  referredBy?: string
}

function normalizeUser(raw: StoredUserPersisted): StoredUser {
  return {
    ...raw,
    tckn: typeof raw.tckn === 'string' ? raw.tckn.replace(/\D/g, '').slice(0, 11) : '',
    phone: typeof raw.phone === 'string' ? raw.phone.trim() : '',
    referredBy: typeof raw.referredBy === 'string' ? raw.referredBy.trim() : '',
    withdrawLockUntil:
      typeof raw.withdrawLockUntil === 'number' ? raw.withdrawLockUntil : 0,
  }
}

export function getStoredUsers(): StoredUser[] {
  const raw = readJson<StoredUserPersisted[]>(KEY_USERS, [])
  return raw.map(normalizeUser)
}

export function saveStoredUsers(users: StoredUser[]) {
  writeJson(KEY_USERS, users)
}

export function getSession(): Session | null {
  return readJson<Session | null>(KEY_SESSION, null)
}

export function setSession(session: Session | null) {
  if (!session) {
    localStorage.removeItem(KEY_SESSION)
    return
  }
  writeJson(KEY_SESSION, session)
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const e = email.trim().toLowerCase()
  return getStoredUsers().find((u) => u.email === e)
}

export function registerUser(input: {
  email: string
  fullName: string
  tckn: string
  phone?: string
  referredBy?: string
  password: string
}): { ok: true; user: StoredUser } | { ok: false; reason: 'exists' } {
  const email = input.email.trim().toLowerCase()
  if (findUserByEmail(email)) {
    return { ok: false, reason: 'exists' }
  }
  const now = Date.now()
  const user: StoredUser = {
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `u-${now}-${Math.random().toString(36).slice(2, 9)}`,
    email,
    fullName: input.fullName.trim(),
    tckn: input.tckn.replace(/\D/g, '').slice(0, 11),
    phone: input.phone?.trim() ?? '',
    referredBy: input.referredBy?.trim() ?? '',
    password: input.password,
    withdrawLockUntil: 0,
  }
  const users = [...getStoredUsers(), user]
  saveStoredUsers(users)
  setSession({ userId: user.id, email: user.email })
  return { ok: true, user }
}

export function verifyLogin(email: string, password: string): StoredUser | null {
  const u = findUserByEmail(email)
  if (!u || u.password !== password) return null
  setSession({ userId: u.id, email: u.email })
  return u
}

export function logoutSession() {
  setSession(null)
}

export function getWithdrawalRequests(): WithdrawalRequest[] {
  return readJson<WithdrawalRequest[]>(KEY_WITHDRAWALS, [])
}

export function addWithdrawalRequest(req: Omit<WithdrawalRequest, 'id' | 'createdAt'>) {
  const list = getWithdrawalRequests()
  const row: WithdrawalRequest = {
    ...req,
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `w-${Date.now()}`,
    createdAt: Date.now(),
  }
  list.push(row)
  writeJson(KEY_WITHDRAWALS, list)
  return row
}

export function getDepositRequests(): DepositRequest[] {
  return readJson<DepositRequest[]>(KEY_DEPOSITS, [])
}

export function addDepositRequest(req: Omit<DepositRequest, 'id' | 'createdAt'>) {
  const list = getDepositRequests()
  const row: DepositRequest = {
    ...req,
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `d-${Date.now()}`,
    createdAt: Date.now(),
  }
  list.push(row)
  writeJson(KEY_DEPOSITS, list)
  return row
}

export type DepositDraft = {
  bankId: string
  bankName: string
  amountTry: number
}

export function getDepositDraft(): Partial<DepositDraft> | null {
  return readJson<Partial<DepositDraft> | null>(KEY_DEPOSIT_DRAFT, null)
}

export function setDepositDraft(draft: Partial<DepositDraft> | null) {
  if (!draft || Object.keys(draft).length === 0) {
    localStorage.removeItem(KEY_DEPOSIT_DRAFT)
    return
  }
  writeJson(KEY_DEPOSIT_DRAFT, draft)
}
