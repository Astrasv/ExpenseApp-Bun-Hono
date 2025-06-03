import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'


const expenseSchema = z.object({
    id: z.number().positive().min(1),
    title: z.string().min(3).max(100),
    amount: z.number().int().positive()
})

type Expense = z.infer<typeof expenseSchema>

const createPostSchema = expenseSchema.omit({id:true})



const fakeExpenses: Expense[] = [
    {id: 1, title: "Groceries", amount:50},
    {id: 2, title: "Uitlities", amount:100},
    {id: 3, title: "Rent", amount:1000},

    {id: 4, title: "Entertainment", amount:500},
    {id: 5, title: "Travel", amount:2000},
    {id: 6, title: "Shopping", amount:1000},
    {id: 7, title: "Dining Out", amount:500},
    {id: 8, title: "Subscriptions", amount:2000},
    {id: 9, title: "Gifts", amount:100},
    {id: 10, title: "Miscellaneous", amount:50},
    {id: 11, title: "Lunch", amount:50},
    {id: 12, title: "Dinner", amount:50},
]

export const expensesRoute = new Hono()
    .get("/total-spent", (c) => {
        const total = fakeExpenses.reduce((acc,expense) => acc+expense.amount,0)
        return c.json({ total })
    })
    .get("/", async (c) => {
        return c.json({expenses: fakeExpenses})
    })
    .post("/",zValidator("json",createPostSchema), async (c) => {
        const expense = await c.req.valid("json")
        fakeExpenses.push({...expense, id: fakeExpenses.length + 1})
        c.status(201)
        return c.json(expense)
    })
    .get("/:id{[0-9]+}", (c) => {
        const id = Number.parseInt(c.req.param("id"))
        const expense = fakeExpenses.find(expense => expense.id === id)
        if(!expense){
            return c.notFound()
        }
        return c.json(expense)
    })
    .delete("/:id{[0-9]+}", (c) => {
        const id = Number.parseInt(c.req.param("id"))
        const index = fakeExpenses.findIndex(expense => expense.id === id)
        if(index === -1){
            return c.notFound()
        }
        
        const deletedExpense = fakeExpenses.splice(index, 1)[0];
        return c.json({expenses: deletedExpense})
    }) 
