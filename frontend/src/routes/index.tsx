import { createFileRoute } from '@tanstack/react-router'


import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/')({
  component: Index,
})


async function getTotalSpent(){
  const res = await api.expenses["total-spent"].$get()
  if(!res.ok){
    throw new Error("Failed to fetch total spent")
  }
  const data = await res.json()
  return data
}

function Index() {

  const{ isPending, isError, data, error } = useQuery({ queryKey: ['get-total-spent'], queryFn: getTotalSpent })

  if (isError) {
    return <span>Error: {error.message}</span>
  }
  return (
    <>
      <Card className='w-[350px] m-auto'>
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>The total amount you have spent</CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>{isPending ? "..." : data.total}</CardContent>
      </Card>  
    </>
  )
}

