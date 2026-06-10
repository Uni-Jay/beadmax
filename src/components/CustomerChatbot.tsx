import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { contactInfo } from '../data/siteContent'

type QuickAction = {
  label: string
  href: string
}

type ChatMessage = {
  id: number
  role: 'bot' | 'user'
  text: string
  time: string
  quickReplies?: string[]
  actions?: QuickAction[]
}

const CHAT_STORAGE_KEY = 'beadmax-chat-history-v1'

function getLagosNow() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }))
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function isLiveAgentAvailable() {
  const lagosNow = getLagosNow()
  const day = lagosNow.getDay()
  const hour = lagosNow.getHours()
  return day >= 1 && day <= 5 && hour >= 8 && hour < 17
}

const starterReplies = ['View our services', 'See bag prices', 'Training details', 'Contact options']

function initialBotMessage(id: number): ChatMessage {
  const available = isLiveAgentAvailable()
  return {
    id,
    role: 'bot',
    text: available
      ? 'Welcome to BeadMax Customer Service. We sell bags, jewelries, and offer vocational training. I am your 24/7 AI assistant, and our live team is online now (Mon-Fri, 8am-5pm).'
      : 'Welcome to BeadMax Customer Service. We sell bags, jewelries, and offer vocational training. I am your 24/7 AI assistant. Our live team is available Mon-Fri, 8am-5pm.',
    time: formatTime(new Date()),
    quickReplies: starterReplies,
  }
}

function loadInitialMessages(): ChatMessage[] {
  if (typeof window === 'undefined') {
    return [initialBotMessage(1)]
  }

  const saved = localStorage.getItem(CHAT_STORAGE_KEY)
  if (!saved) {
    return [initialBotMessage(1)]
  }

  try {
    const parsed = JSON.parse(saved) as ChatMessage[]
    return parsed.length ? parsed : [initialBotMessage(1)]
  } catch {
    return [initialBotMessage(1)]
  }
}

function getBotResponse(input: string): Omit<ChatMessage, 'id' | 'time' | 'role'> {
  const text = input.toLowerCase()
  const phone = contactInfo.whatsappNumber
  const makeWhatsappLink = (message: string) => {
    const formatted = encodeURIComponent(message)
    return `https://wa.me/${phone.replace('+', '')}?text=${formatted}`
  }

  if (/how to register|register|registration|receipt/.test(text)) {
    return {
      text: 'To register, fill the BeadMax Vocational School Google Form. After payment, send your receipt to +2348060886447 on WhatsApp for confirmation.',
      quickReplies: ['I have sent my receipt', 'Training timetable', 'Talk to customer care'],
      actions: [
        {
          label: 'Open Registration Form',
          href: 'https://docs.google.com/forms/d/e/1FAIpQLScP9ouLRKyZ4CR97ygDdKWWZZ3_6FE-F87zoILzo46CW58nqg/viewform?usp=header',
        },
        {
          label: 'Send Receipt on WhatsApp',
          href: makeWhatsappLink(
            'Hello BeadMax Vocational School, I have completed registration and I am sending my receipt for confirmation.',
          ),
        },
      ],
    }
  }

  if (/price|cost|amount|budget/.test(text)) {
    return {
      text: 'Cost price varies based on design style, bead type, quantity, and delivery timeline. Contact us directly and we will provide a tailored quote quickly.',
      quickReplies: ['I want a bag quote', 'I want jewelry quote', 'Talk to customer care'],
      actions: [
        {
          label: 'Get Quote on WhatsApp',
          href: makeWhatsappLink(
            'Hello BeadMax Design, I need a quote. Please share pricing based on my preferred design and quantity.',
          ),
        },
      ],
    }
  }

  if (/bag|purse|clutch/.test(text)) {
    return {
      text: 'Our bag collection includes Bridal, Luxury, Casual, and Corporate styles. We can also create a custom piece for your event or brand.',
      quickReplies: ['Show bridal bags', 'Show luxury bags', 'Order via WhatsApp'],
      actions: [
        {
          label: 'Order a Bag',
          href: makeWhatsappLink(
            'Hello BeadMax Design, I want to order a bag. Please guide me with available styles, pricing, and delivery timeline.',
          ),
        },
      ],
    }
  }

  if (/jewel|necklace|bracelet|earring/.test(text)) {
    return {
      text: 'We create bespoke jewelry for personal styling, bridal looks, and events. You can request custom colors, names, and finishing options.',
      quickReplies: ['Custom jewelry order', 'Bridal jewelry', 'Delivery options'],
    }
  }

  if (/train|school|class|course|vocational/.test(text)) {
    return {
      text: 'Training at Beadmax Vocational School is NGN 150,000 for 3 months with a flexible timetable. Contact us directly to register and get available class slots.',
      quickReplies: ['How to register', 'Training timetable', 'Pay for training'],
      actions: [
        {
          label: 'Training Enquiry on WhatsApp',
          href: makeWhatsappLink(
            'Hello BeadMax Vocational School, I want to register for training (NGN 150,000 for 3 months). Kindly share available timetable and payment steps.',
          ),
        },
      ],
    }
  }

  if (/deliver|ship|international|local/.test(text)) {
    return {
      text: 'We handle both local and international orders. Delivery cost and timeline depend on destination and item size.',
      quickReplies: ['Nigeria delivery', 'International delivery', 'Speak to an agent'],
    }
  }

  if (/where|address|location|office/.test(text)) {
    return {
      text: `Our office address is: ${contactInfo.address}`,
      quickReplies: ['Call now', 'Share map direction', 'Business hours'],
    }
  }

  if (/hour|open|time|day/.test(text)) {
    return {
      text: 'Business hours: Monday to Friday, 8:00am - 5:00pm. AI chatbot support is available 24/7 for immediate assistance.',
      quickReplies: ['Talk to customer care', 'Call now', 'WhatsApp us'],
    }
  }

  if (/human|agent|customer care|support|talk to/.test(text)) {
    const available = isLiveAgentAvailable()
    return {
      text: available
        ? 'Our customer care team is currently online. You can call directly or continue here while I connect you to the fastest channel.'
        : 'Our customer care team is currently offline (Mon-Fri, 8am-5pm). Please leave your request here or contact us on WhatsApp and we will respond during business hours.',
      quickReplies: ['Call now', 'Chat on WhatsApp', 'Leave a request'],
      actions: [
        { label: 'Call +2348170020431', href: `tel:${contactInfo.phones[0]}` },
        { label: 'Call +2348060886447', href: `tel:${contactInfo.phones[1]}` },
        { label: 'Call +2348032223420', href: `tel:${contactInfo.phones[2]}` },
        {
          label: 'Open WhatsApp',
          href: makeWhatsappLink(
            'Hello BeadMax Customer Care, I need assistance with my order/training enquiry. Please support me.',
          ),
        },
      ],
    }
  }

  if (/phone|call|number|whatsapp/.test(text)) {
    return {
      text: `You can reach us on ${contactInfo.phones[0]}, ${contactInfo.phones[1]}, or ${contactInfo.phones[2]}.`,
      quickReplies: ['Call first number', 'Call second number', 'Call third number'],
      actions: [
        { label: 'Call +2348170020431', href: `tel:${contactInfo.phones[0]}` },
        { label: 'Call +2348060886447', href: `tel:${contactInfo.phones[1]}` },
        { label: 'Call +2348032223420', href: `tel:${contactInfo.phones[2]}` },
        {
          label: 'Open WhatsApp (+2348060886447)',
          href: makeWhatsappLink(
            'Hello BeadMax Design, I am contacting you for quote and support. Kindly assist me.',
          ),
        },
      ],
    }
  }

  if (/instagram|ig|social|handle/.test(text)) {
    return {
      text: `Our Instagram handle is ${contactInfo.instagramHandle}. Follow us for latest bag and jewelry updates.`,
      quickReplies: ['Open Instagram', 'Chat on WhatsApp', 'Talk to customer care'],
      actions: [{ label: 'Open Instagram', href: contactInfo.instagramLink }],
    }
  }

  return {
    text: 'Thanks for your message. I can help with bag and jewelry orders, training (NGN 150,000 / 3 months), delivery, pricing, and customer care routing.',
    quickReplies: starterReplies,
  }
}

function CustomerChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadInitialMessages())
  const [textInput, setTextInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messageIdRef = useRef(messages.reduce((max, message) => Math.max(max, message.id), 0) + 1)
  const listRef = useRef<HTMLDivElement | null>(null)
  const openRef = useRef(isOpen)

  useEffect(() => {
    openRef.current = isOpen
  }, [isOpen])

  useEffect(() => {
    if (!messages.length) return
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-40)))
  }, [messages])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, isTyping])

  const liveAgentOnline = isLiveAgentAvailable()

  const nextMessageId = () => {
    const id = messageIdRef.current
    messageIdRef.current += 1
    return id
  }

  const appendUserMessage = (text: string) => {
    const cleanText = text.trim()
    if (!cleanText) return

    const userMessage: ChatMessage = {
      id: nextMessageId(),
      role: 'user',
      text: cleanText,
      time: formatTime(new Date()),
    }

    setMessages((current) => [...current, userMessage])
    setTextInput('')
    setIsTyping(true)

    window.setTimeout(() => {
      const response = getBotResponse(cleanText)
      const botMessage: ChatMessage = {
        id: nextMessageId(),
        role: 'bot',
        text: response.text,
        time: formatTime(new Date()),
        quickReplies: response.quickReplies,
        actions: response.actions,
      }
      setMessages((current) => [...current, botMessage])
      setIsTyping(false)
      if (!openRef.current) setUnreadCount((count) => count + 1)
    }, 760)
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    appendUserMessage(textInput)
  }

  const restartChat = () => {
    const initial = [initialBotMessage(nextMessageId())]
    setMessages(initial)
    setTextInput('')
    setIsTyping(false)
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(initial))
  }

  return (
    <div className="chatbot-root" aria-live="polite">
      <button
        type="button"
        className="chatbot-launcher"
        onClick={() => {
          setIsOpen((value) => !value)
          if (!isOpen) setUnreadCount(0)
        }}
        aria-label="Open customer service chatbot"
      >
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path d="M12 3C6.49 3 2 6.94 2 11.8c0 2.48 1.17 4.7 3.13 6.26-.08 1.16-.41 2.29-.98 3.3a.78.78 0 0 0 .94 1.12c1.84-.55 3.45-1.37 4.8-2.44.7.12 1.42.18 2.11.18 5.51 0 10-3.94 10-8.8S17.51 3 12 3Zm-4 7.9a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Zm4 0a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Zm4 0a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Z" />
        </svg>
        <span className="sr-only">AI Customer Service</span>
        {unreadCount > 0 ? <strong className="chatbot-unread">{unreadCount}</strong> : null}
      </button>

      {isOpen ? (
        <section className="chatbot-panel" aria-label="BeadMax AI customer service chatbot">
          <header className="chatbot-header">
            <div>
              <h3>BeadMax AI Assistant</h3>
              <p>
                24/7 Assistant • Live Team:{' '}
                <span className={liveAgentOnline ? 'status-online' : 'status-offline'}>
                  {liveAgentOnline ? 'Online now' : 'Offline now'}
                </span>
              </p>
              <small>Mon-Fri, 8:00am - 5:00pm (live agents)</small>
            </div>
            <div className="chatbot-header-actions">
              <button type="button" onClick={restartChat} aria-label="Restart chat" title="Restart chat">
                <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                  <path d="M12 5a7 7 0 1 1-6.72 8.95 1 1 0 0 1 1.92-.56A5 5 0 1 0 12 7h-1.9l1.45 1.44a1 1 0 1 1-1.41 1.42L6.96 6.7a1 1 0 0 1 0-1.41l3.18-3.18a1 1 0 1 1 1.41 1.41L10.1 5H12Z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
                title="Close chatbot"
              >
                <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                  <path d="M6.7 5.3a1 1 0 0 0-1.4 1.4L10.6 12l-5.3 5.3a1 1 0 1 0 1.4 1.4l5.3-5.3 5.3 5.3a1 1 0 0 0 1.4-1.4L13.4 12l5.3-5.3a1 1 0 1 0-1.4-1.4L12 10.6 6.7 5.3Z" />
                </svg>
              </button>
            </div>
          </header>

          <div className="chatbot-messages" ref={listRef}>
            {messages.map((message) => (
              <article key={message.id} className={message.role === 'bot' ? 'msg-bot' : 'msg-user'}>
                <p>{message.text}</p>
                <time>{message.time}</time>

                {message.quickReplies?.length ? (
                  <div className="quick-replies">
                    {message.quickReplies.map((reply) => (
                      <button type="button" key={reply} onClick={() => appendUserMessage(reply)}>
                        {reply}
                      </button>
                    ))}
                  </div>
                ) : null}

                {message.actions?.length ? (
                  <div className="message-actions">
                    {message.actions.map((action) => (
                      <a key={action.href + action.label} href={action.href} target="_blank" rel="noreferrer">
                        {action.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}

            {isTyping ? <p className="chatbot-typing">Assistant is typing...</p> : null}
          </div>

          <form className="chatbot-form" onSubmit={onSubmit}>
            <input
              type="text"
              value={textInput}
              onChange={(event) => setTextInput(event.target.value)}
              placeholder="Ask about prices, training, delivery..."
              aria-label="Chat message"
            />
            <button type="submit" aria-label="Send message" title="Send message">
              <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path d="M3.4 11.2 19.9 4.1c.9-.4 1.8.5 1.4 1.4l-7.1 16.5c-.4.9-1.8.9-2.1 0l-2.1-6.2-6.2-2.1c-.9-.3-.9-1.7 0-2.1Zm2.9 1.1 4.9 1.7a1 1 0 0 1 .6.6l1.7 4.9 5.2-12.2-12.4 5Z" />
              </svg>
            </button>
          </form>
        </section>
      ) : null}
    </div>
  )
}

export default CustomerChatbot
