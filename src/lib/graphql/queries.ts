import { gql } from '@apollo/client'

export const TASK_FIELDS = gql`
  fragment TaskFields on Task {
    id
    title
    description
    status
    createdAt
    updatedAt
  }
`

export const GET_TASKS = gql`
  ${TASK_FIELDS}
  query GetTasks($status: TaskStatusEnum) {
    tasks(status: $status) {
      ...TaskFields
    }
  }
`

export const GET_TASK = gql`
  ${TASK_FIELDS}
  query GetTask($id: ID!) {
    task(id: $id) {
      ...TaskFields
    }
  }
`
