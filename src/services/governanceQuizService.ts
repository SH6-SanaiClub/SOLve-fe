import { apiClient } from './apiClient'
import type {
  GovernanceQuizOption,
  GovernanceQuizResult,
  GovernanceQuizSubmitRequest,
  GovernanceQuizToday,
} from '../types/governanceQuiz'

type UnknownRecord = Record<string, unknown>

function unwrapPayload<T>(payload: T | { data?: T }) {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in (payload as Record<string, unknown>) &&
    (payload as { data?: T }).data
  ) {
    return (payload as { data?: T }).data as T
  }

  return payload as T
}

function asRecord(value: unknown): UnknownRecord {
  if (value && typeof value === 'object') {
    return value as UnknownRecord
  }

  return {}
}

function asString(value: unknown) {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return ''
}

function asNullableString(value: unknown) {
  const normalized = asString(value).trim()
  return normalized.length > 0 ? normalized : null
}

function asBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : false
}

function isCompletedStatus(value: unknown) {
  if (typeof value !== 'string') {
    return false
  }

  const normalized = value.trim().toLowerCase()

  return [
    'completed',
    'complete',
    'done',
    'solved',
    'submitted',
    'already_solved',
    'already_completed',
  ].includes(normalized)
}

function isCompletedMessage(value: unknown) {
  if (typeof value !== 'string') {
    return false
  }

  return /(이미|already).*(완료|풀|참여|submitted|solved|completed)/i.test(value)
}

function asNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

function pickFirst<T>(...values: T[]) {
  return values.find((value) => value !== undefined && value !== null)
}

function normalizeOptions(rawOptions: unknown): GovernanceQuizOption[] {
  if (!Array.isArray(rawOptions)) {
    return []
  }

  return rawOptions
    .map((option, index) => {
      const record = asRecord(option)
      const id = asNullableString(
        pickFirst(record.optionId, record.id, record.choiceId, record.answerId, index + 1),
      )
      const text = asString(
        pickFirst(record.content, record.text, record.optionText, record.answerText, record.label),
      ).trim()

      if (!id || !text) {
        return null
      }

      return {
        id,
        text,
        order: asNumber(pickFirst(record.order, record.sequence, index + 1)) || index + 1,
      }
    })
    .filter((option): option is GovernanceQuizOption => option !== null)
}

function findOptionText(options: GovernanceQuizOption[], optionId: string | null) {
  if (!optionId) {
    return ''
  }

  return options.find((option) => option.id === optionId)?.text ?? ''
}

function normalizeTodayPayload(payload: unknown): GovernanceQuizToday {
  const raw = asRecord(unwrapPayload(payload))
  const message = asNullableString(
    pickFirst(raw.message, raw.statusMessage, raw.completedMessage),
  )
  const options = normalizeOptions(
    pickFirst(raw.options, raw.choice, raw.answers, raw.quizOptions),
  )
  const selectedOptionId = asNullableString(
    pickFirst(raw.selectedOptionId, raw.userAnswerId, raw.submittedOptionId, raw.choiceId),
  )
  const correctOptionId = asNullableString(
    pickFirst(raw.correctOptionId, raw.answerOptionId, raw.correctAnswerId, raw.correctChoiceId),
  )
  const alreadySolved = asBoolean(
    pickFirst(
      raw.alreadySolved,
      raw.completed,
      raw.solved,
      raw.participatedToday,
      raw.todaySolved,
      raw.isSubmitted,
      raw.submitted,
    ),
  )
  const completedByStatus = isCompletedStatus(
    pickFirst(raw.status, raw.quizStatus, raw.solveStatus, raw.participationStatus),
  )
  const completedByMessage = isCompletedMessage(message)
  const question = asString(
    pickFirst(raw.question, raw.quizQuestion, raw.problem, raw.contents),
  ).trim()

  const status: GovernanceQuizToday['status'] = alreadySolved
    || completedByStatus
    || completedByMessage
    ? 'completed'
    : question && options.length > 0
      ? 'available'
      : 'empty'

  return {
    status,
    quizId: asNullableString(pickFirst(raw.quizId, raw.id, raw.todayQuizId)) ?? '',
    title: asString(pickFirst(raw.title, raw.quizTitle)).trim() || '오늘의 금융 Quiz!',
    question,
    options,
    alreadySolved: alreadySolved || completedByStatus || completedByMessage,
    selectedOptionId,
    correctOptionId,
    explanation: asNullableString(
      pickFirst(raw.explanation, raw.commentary, raw.answerExplanation, raw.description),
    ),
    rewardPoint: asNumber(pickFirst(raw.rewardPoint, raw.point, raw.earnedPoint)),
    message,
    correctMessage: asNullableString(
      pickFirst(raw.correctMessage, raw.successMessage),
    ),
    incorrectMessage: asNullableString(
      pickFirst(raw.incorrectMessage, raw.failMessage),
    ),
  }
}

function normalizeSubmitPayload(
  payload: unknown,
  fallbackOptions: GovernanceQuizOption[],
  request: GovernanceQuizSubmitRequest,
): GovernanceQuizResult {
  const raw = asRecord(unwrapPayload(payload))
  const options = normalizeOptions(
    pickFirst(raw.options, raw.choice, raw.answers, raw.quizOptions),
  )
  const mergedOptions = options.length > 0 ? options : fallbackOptions
  const selectedOptionId =
    asNullableString(
      pickFirst(raw.selectedOptionId, raw.userAnswerId, raw.submittedOptionId, request.selectedOptionId),
    ) ?? request.selectedOptionId
  const correctOptionId = asNullableString(
    pickFirst(raw.correctOptionId, raw.answerOptionId, raw.correctAnswerId, raw.correctChoiceId),
  )
  const isCorrect = asBoolean(
    pickFirst(raw.correct, raw.isCorrect, raw.answerCorrect, raw.approved),
  )
  const selectedOptionText =
    asString(
      pickFirst(raw.selectedOptionText, raw.userAnswerText, raw.choiceText),
    ).trim() || findOptionText(mergedOptions, selectedOptionId)
  const correctOptionText =
    asString(
      pickFirst(raw.correctOptionText, raw.answerText, raw.correctAnswerText),
    ).trim() || findOptionText(mergedOptions, correctOptionId)

  return {
    quizId:
      asNullableString(pickFirst(raw.quizId, raw.id, request.quizId)) ?? request.quizId,
    selectedOptionId,
    selectedOptionText,
    correctOptionId,
    correctOptionText,
    isCorrect,
    explanation: asNullableString(
      pickFirst(raw.explanation, raw.commentary, raw.answerExplanation, raw.description),
    ),
    rewardPoint: asNumber(pickFirst(raw.rewardPoint, raw.point, raw.earnedPoint)),
    message: asNullableString(
      pickFirst(
        raw.message,
        raw.statusMessage,
        isCorrect ? raw.correctMessage : raw.incorrectMessage,
      ),
    ),
    alreadySolved: asBoolean(pickFirst(raw.alreadySolved, raw.completed, raw.solved)),
  }
}

export async function getTodayGovernanceQuiz(): Promise<GovernanceQuizToday> {
  const response = await apiClient.get('/v1/esg/g/quiz/today')
  return normalizeTodayPayload(response.data)
}

export async function submitGovernanceQuiz(
  request: GovernanceQuizSubmitRequest,
  options: GovernanceQuizOption[],
): Promise<GovernanceQuizResult> {
  const response = await apiClient.post('/v1/esg/g/quiz/submit', {
    quizId: request.quizId,
    selectedOptionId: request.selectedOptionId,
  })

  return normalizeSubmitPayload(response.data, options, request)
}

export function toGovernanceQuizResult(today: GovernanceQuizToday): GovernanceQuizResult {
  const selectedOptionText = findOptionText(today.options, today.selectedOptionId)
  const correctOptionText = findOptionText(today.options, today.correctOptionId)

  return {
    quizId: today.quizId,
    selectedOptionId: today.selectedOptionId ?? '',
    selectedOptionText,
    correctOptionId: today.correctOptionId,
    correctOptionText,
    isCorrect:
      Boolean(today.selectedOptionId) &&
      Boolean(today.correctOptionId) &&
      today.selectedOptionId === today.correctOptionId,
    explanation: today.explanation,
    rewardPoint: today.rewardPoint,
    message: today.message,
    alreadySolved: today.alreadySolved,
  }
}
