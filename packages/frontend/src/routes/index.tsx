import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {

  const { auth } = Route.useRouteContext()

  return (
    <div className="text-center flex flex-col h">
      <div>{JSON.stringify(auth, null, 4)}</div>
      <Link className='hover:underline' to='/dashboard'>Dashboard</Link>
      <Link className='hover:underline' to='/register'>Register</Link>
      <Link className='hover:underline' to='/login'>Login</Link>
    </div>
  )
}
