'use client'

import React, { useState } from 'react'
import { siteMetadata } from '@/data/siteMetaData'

export default function NewsletterForm({ title = 'Subscribe to newsletter' }) {
  const [email, setEmail] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const subscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const res = await fetch(`/api/${siteMetadata.newsLetter.provider}`, {
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
    const { error } = await res.json()
    if (error) {
      setErrorMessage('Your email address is invalid or already subscribed.')
      return
    }

    setEmail('')
    setErrorMessage('')
    setSubscribed(true)
  }

  return (
    <div>
      <div className="pb-1 text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</div>
      <form className="flex flex-col sm:flex-row" onSubmit={subscribe}>
        <div>
          <label className="sr-only" htmlFor="email-input">
            Email address
          </label>
          <input
            autoComplete="email"
            id="email-input"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            disabled={subscribed}
          />
        </div>
        <div className="mt-2 flex w-full rounded-md shadow-sm sm:ml-3 sm:mt-0">
          <button
            className={`bg-primary-500 w-full rounded-md px-4 py-2 font-medium text-white sm:py-0 ${
              subscribed ? 'cursor-default' : 'hover:bg-primary-700 dark:hover:bg-primary-400'
            } focus:ring-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-black`}
            type="submit"
            disabled={subscribed}
          >
            {subscribed ? 'Thank you!' : 'Sign up'}
          </button>
        </div>
      </form>
      {errorMessage && (
        <div className="w-72 pt-2 text-sm text-red-500 dark:text-red-400 sm:w-96">
          {errorMessage}
        </div>
      )}
    </div>
  )
}

export const BlogNewsletterForm = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center">
    <div className="bg-gray-100 p-6 dark:bg-gray-800 sm:px-14 sm:py-8">
      <NewsletterForm title={title} />
    </div>
  </div>
)
