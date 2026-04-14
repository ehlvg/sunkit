import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { Alert } from '../components/Alert'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ColorPicker } from '../components/ColorPicker'
import { DatePicker } from '../components/DatePicker'
import { Input } from '../components/Input'
import { Progress } from '../components/Progress'
import { Select } from '../components/Select'
import { Slider } from '../components/Slider'
import { Textarea } from '../components/Textarea'
import { Toggle } from '../components/Toggle'
import type { ButtonColor } from '../components/Button'

const CATEGORY_OPTIONS = [
  { value: 'design',      label: 'Design'         },
  { value: 'engineering', label: 'Engineering'     },
  { value: 'research',    label: 'Research'        },
  { value: 'marketing',   label: 'Marketing'       },
  { value: 'ops',         label: 'Operations'      },
]

const TEAM_OPTIONS = [
  { value: 'solo',    label: 'Just me'         },
  { value: 'small',   label: 'Small (2–5)'     },
  { value: 'medium',  label: 'Medium (6–15)'   },
  { value: 'large',   label: 'Large (16+)'     },
]

const TONE_FROM_COLOR: Record<ButtonColor, 'rose' | 'peach' | 'lemon' | 'mint' | 'sky' | 'lavender' | 'lilac' | 'neutral'> = {
  rose:     'rose',
  peach:    'peach',
  lemon:    'lemon',
  mint:     'mint',
  sky:      'sky',
  lavender: 'lavender',
  lilac:    'lilac',
  neutral:  'neutral',
}

function ProjectSetupApp() {
  const [name, setName]             = useState('')
  const [category, setCategory]     = useState('')
  const [team, setTeam]             = useState('')
  const [deadline, setDeadline]     = useState<Date | null>(null)
  const [color, setColor]           = useState<ButtonColor>('lavender')
  const [priority, setPriority]     = useState(50)
  const [description, setDescription] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [isPublic, setIsPublic]     = useState(false)
  const [aiAssist, setAiAssist]     = useState(false)

  const [submitted, setSubmitted]   = useState(false)
  const [nameError, setNameError]   = useState('')

  const tone = TONE_FROM_COLOR[color]

  const filledFields = [
    name.trim().length > 0,
    category !== '',
    team !== '',
    deadline !== null,
    description.trim().length > 0,
  ]
  const completion = Math.round((filledFields.filter(Boolean).length / filledFields.length) * 100)

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError('Project name is required.')
      return
    }
    setNameError('')
    setSubmitted(true)
  }

  const handleReset = () => {
    setName('')
    setCategory('')
    setTeam('')
    setDeadline(null)
    setColor('lavender')
    setPriority(50)
    setDescription('')
    setNotifications(true)
    setIsPublic(false)
    setAiAssist(false)
    setSubmitted(false)
    setNameError('')
  }

  const priorityLabel =
    priority < 34 ? 'Low' : priority < 67 ? 'Medium' : 'High'

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '48px 24px',
        background: '#f7f6f3',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ width: '100%', maxWidth: 560 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'rgba(0,0,0,0.80)', letterSpacing: '-0.3px' }}>
            New project
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>
            Fill in the details below to get started.
          </p>
        </div>

        {/* Completion progress */}
        <div style={{ marginBottom: 24 }}>
          <Progress
            value={completion}
            tone={tone}
            size="sm"
            label="Form completion"
            showValue
          />
        </div>

        {submitted && (
          <div style={{ marginBottom: 20 }}>
            <Alert
              variant="success"
              title="Project created!"
              dismissable
              onDismiss={handleReset}
            >
              <strong>{name}</strong> has been created with{' '}
              {priorityLabel.toLowerCase()} priority.{' '}
              {deadline ? `Deadline: ${deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.` : ''}
            </Alert>
          </div>
        )}

        {!submitted && priority >= 80 && (
          <div style={{ marginBottom: 20 }}>
            <Alert variant="warning" title="High priority">
              This project is flagged as high priority. Make sure your team is aligned before launching.
            </Alert>
          </div>
        )}

        {/* Main card */}
        <Card variant="elevated" tone={tone} radius={20}>
          <Card.Header>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.65)' }}>
                Project details
              </span>
              <ColorPicker
                value={color}
                onChange={c => setColor(c)}
                size="sm"
              />
            </div>
          </Card.Header>

          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              <Input
                label="Project name"
                placeholder="e.g. Brand refresh 2026"
                value={name}
                onChange={e => { setName(e.target.value); if (e.target.value) setNameError('') }}
                tone={tone}
                error={nameError || undefined}
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Select
                  label="Category"
                  options={CATEGORY_OPTIONS}
                  value={category}
                  onChange={setCategory}
                  placeholder="Pick one…"
                  tone={tone}
                  searchable
                />
                <Select
                  label="Team size"
                  options={TEAM_OPTIONS}
                  value={team}
                  onChange={setTeam}
                  placeholder="Pick one…"
                  tone={tone}
                />
              </div>

              <DatePicker
                label="Deadline"
                value={deadline}
                onChange={setDeadline}
                tone={tone}
                minDate={new Date()}
                placeholder="Pick a date…"
              />

              <Textarea
                label="Description"
                placeholder="What is this project about? What's the goal?"
                value={description}
                onChange={e => setDescription(e.target.value)}
                tone={tone}
                rows={3}
                autoResize
                maxLength={300}
                showCount
                description="Briefly describe the scope and objectives."
              />

              <Slider
                label="Priority"
                min={0}
                max={100}
                step={1}
                value={priority}
                onValueChange={setPriority}
                tone={tone}
                showValue={false}
                marks={[
                  { value: 0,   label: 'Low'    },
                  { value: 50,  label: 'Medium' },
                  { value: 100, label: 'High'   },
                ]}
                description={`Currently set to ${priorityLabel.toLowerCase()} priority (${priority}/100).`}
              />

            </div>
          </Card.Body>

          <Card.Footer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Toggle
                tone={tone}
                checked={notifications}
                onCheckedChange={setNotifications}
                label="Email notifications"
                description="Get notified when collaborators leave comments or update tasks."
              />
              <Toggle
                tone={tone}
                checked={isPublic}
                onCheckedChange={setIsPublic}
                label="Make project public"
                description="Anyone with the link can view this project in read-only mode."
              />
              <Toggle
                tone={tone}
                size="sm"
                checked={aiAssist}
                onCheckedChange={setAiAssist}
                label="AI suggestions"
                description="Let the assistant propose tasks and deadlines based on your description."
              />
            </div>
          </Card.Footer>
        </Card>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
          <Button color="neutral" onClick={handleReset}>
            Discard
          </Button>
          <Button color={color} onClick={handleSubmit}>
            Create project
          </Button>
        </div>

        {/* Info alert at the bottom */}
        <div style={{ marginTop: 24 }}>
          <Alert variant="info" title="You can change these settings later">
            Everything here can be edited from the project settings page at any time.
          </Alert>
        </div>

      </div>
    </div>
  )
}

const meta: Meta = {
  title: 'Examples/Project Setup',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj

export const Default: Story = {
  render: () => <ProjectSetupApp />,
}
