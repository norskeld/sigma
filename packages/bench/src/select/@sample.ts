import type * as Ast from './ast.ts'

const NAMES = [
  'id',
  'guid',
  'index',
  'isActive',
  'balance',
  'picture',
  'age',
  'eyeColor',
  'name',
  'gender',
  'company',
  'email',
  'phone',
  'address',
  'about',
  'registered',
]

function columns(count: number): Array<Ast.Identifier> {
  const values: Array<Ast.Identifier> = []

  for (let index = 0; index < count; index++) {
    values.push({ type: 'identifier', name: `${NAMES[index % NAMES.length]}${index}` })
  }

  return values
}

function renderAtomic(node: Ast.AtomicExpression): string {
  return node.type === 'identifier' ? node.name : String(node.value)
}

function render(statement: Ast.SelectStatement): string {
  const { select, from, where } = statement

  const clauses = [
    `SELECT ${select.columns.map((column) => column.name).join(', ')}`,
    `FROM ${from.table.name}`,
  ]

  if (where !== null) {
    const { lhs, operator, rhs } = where.condition
    clauses.push(`WHERE ${renderAtomic(lhs)} ${operator} ${renderAtomic(rhs)}`)
  }

  return clauses.join(' ')
}

export const EXPECTED: Ast.SelectStatement = {
  type: 'statement',
  select: {
    type: 'select',
    columns: columns(2048),
  },
  from: {
    type: 'from',
    table: {
      type: 'identifier',
      name: 'customers',
    },
  },
  where: {
    type: 'where',
    condition: {
      type: 'expression',
      lhs: {
        type: 'identifier',
        name: 'ageOfPerson',
      },
      operator: '>',
      rhs: {
        type: 'integer',
        value: 42,
      },
    },
  },
}

export const SAMPLE: string = render(EXPECTED)
