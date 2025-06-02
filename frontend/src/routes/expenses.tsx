import { api } from '@/lib/api'
import { createFileRoute } from '@tanstack/react-router'
import {useQuery} from '@tanstack/react-query'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

export const Route = createFileRoute('/expenses')({
  component: Expenses,
  loader: getAllExpenses
})


async function getAllExpenses(){
    const res = await api.expenses.$get()
    if(!res.ok){
      throw new Error("Failed to fetch total spent")
    }
    const data = await res.json()
    return data
  }

function Expenses() {
  const {data, isPending, error} = useQuery({
    queryKey: ["get-all-expenses"],
    queryFn: getAllExpenses
  })

  if (error) return <div className="p-2">Error: {error.message}</div>
  return (
  <div className="p-2 max-w-3xl mx-auto">
    <Table>
        <TableCaption>A list of all your expenses.</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {isPending ? "Loading..." : data?.expenses.map((expense: any) => (
                <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.id}</TableCell>
                    <TableCell>{expense.title}</TableCell>
                    <TableCell>{expense.amount}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
    </div>
  )
}