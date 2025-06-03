import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Button } from '@/components/ui/button'
import { useForm } from '@tanstack/react-form'
import { api } from '@/lib/api'


export const Route = createFileRoute('/create-expense')({
  component: CreateExpense,
})


function CreateExpense() {

  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      title: '',
      amount: 0,
    },
    onSubmit: async ({ value }) => {
      const res = await api.expenses.$post({json: value})
      if(!res.ok){
        throw new Error("Server Error")
      }
      navigate({to: "/expenses"})
    },
  })
  return (
    <div className="p-2">
       <h2>CreateExpense</h2>
       <form 
        action="" 
        className='max-w-xl m-auto'        
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field
            name="title"
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <Label htmlFor={field.name}>Title</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid ? (
                    <em>{field.state.meta.errors.join(', ')}</em>
                  ) : null}
                </>
              )
            }}
          />


          <form.Field
            name="amount"
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <Label htmlFor={field.name}>Title</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    type='number'
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid ? (
                    <em>{field.state.meta.errors.join(', ')}</em>
                  ) : null}
                </>
              )
            }}
          />
        
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" className='mt-4' disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Create Expense'}
            </Button>
          )}
        />
       </form>
    </div>
  )
}