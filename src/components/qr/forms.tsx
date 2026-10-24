'use client'

/**
 * Type-specific payload forms for the QR generator.
 */
import { Field, Input, Textarea, Select } from '@/components/ui/input'
import type {
	EmailPayload,
	EventPayload,
	LocationPayload,
	QrPayloadMap,
	QrToolId,
	SmsPayload,
	VCardPayload,
	WhatsAppPayload,
	WifiPayload,
} from '@/types/qr'

export function QrTypeForm<T extends QrToolId> ({
	type,
	payload,
	onChange,
}: {
	type: T
	payload: QrPayloadMap[T]
	onChange: (next: QrPayloadMap[T]) => void
}) {
	switch (type) {
		case 'url':
		case 'pdf':
			return (
				<UrlForm
					value={(payload as QrPayloadMap['url']).url}
					onChange={(url) => onChange({ url } as QrPayloadMap[T])}
					pdfHint={type === 'pdf'}
				/>
			)
		case 'text':
			return (
				<Field label="Текст" htmlFor="text">
					<Textarea
						id="text"
						value={(payload as QrPayloadMap['text']).text}
						onChange={(e) =>
							onChange({ text: e.target.value } as QrPayloadMap[T])
						}
						placeholder="Любой текст, включая кириллицу"
						rows={5}
					/>
				</Field>
			)
		case 'wifi':
			return (
				<WifiForm
					value={payload as WifiPayload}
					onChange={(wifi) => onChange(wifi as QrPayloadMap[T])}
				/>
			)
		case 'vcard':
			return (
				<VCardForm
					value={payload as VCardPayload}
					onChange={(v) => onChange(v as QrPayloadMap[T])}
				/>
			)
		case 'email':
			return (
				<EmailForm
					value={payload as EmailPayload}
					onChange={(v) => onChange(v as QrPayloadMap[T])}
				/>
			)
		case 'phone':
			return (
				<Field
					label="Номер телефона"
					htmlFor="phone"
					hint="Международный префикс сохраняется (например +7…)"
				>
					<Input
						id="phone"
						value={(payload as QrPayloadMap['phone']).phone}
						onChange={(e) =>
							onChange({ phone: e.target.value } as QrPayloadMap[T])
						}
						placeholder="+79991234567"
						inputMode="tel"
						autoComplete="tel"
					/>
				</Field>
			)
		case 'sms':
			return (
				<SmsForm
					value={payload as SmsPayload}
					onChange={(v) => onChange(v as QrPayloadMap[T])}
				/>
			)
		case 'telegram':
			return (
				<Field
					label="Username или ссылка"
					htmlFor="tg"
					hint="Публичные профили и каналы. Приватные чаты не гарантируются."
				>
					<Input
						id="tg"
						value={(payload as QrPayloadMap['telegram']).value}
						onChange={(e) =>
							onChange({ value: e.target.value } as QrPayloadMap[T])
						}
						placeholder="@username или https://t.me/…"
					/>
				</Field>
			)
		case 'whatsapp':
			return (
				<WhatsAppForm
					value={payload as WhatsAppPayload}
					onChange={(v) => onChange(v as QrPayloadMap[T])}
				/>
			)
		case 'location':
			return (
				<LocationForm
					value={payload as LocationPayload}
					onChange={(v) => onChange(v as QrPayloadMap[T])}
				/>
			)
		case 'event':
			return (
				<EventForm
					value={payload as EventPayload}
					onChange={(v) => onChange(v as QrPayloadMap[T])}
				/>
			)
		default:
			return null
	}
}

function UrlForm ({
	value,
	onChange,
	pdfHint,
}: {
	value: string
	onChange: (v: string) => void
	pdfHint?: boolean
}) {
	return (
		<Field
			label={pdfHint ? 'Публичная HTTPS-ссылка на файл' : 'Ссылка (URL)'}
			htmlFor="url"
			hint={
				pdfHint
					? 'Документ должен быть уже опубликован в интернете. Загрузка файлов на сервер не выполняется.'
					: 'HTTP и HTTPS. Если схема не указана, добавится https://'
			}
		>
			<Input
				id="url"
				type="url"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={pdfHint ? 'https://example.com/file.pdf' : 'https://example.com'}
				autoComplete="url"
			/>
		</Field>
	)
}

function WifiForm ({
	value,
	onChange,
}: {
	value: WifiPayload
	onChange: (v: WifiPayload) => void
}) {
	return (
		<div className="space-y-4">
			<Field label="Название сети (SSID)" htmlFor="ssid">
				<Input
					id="ssid"
					value={value.ssid}
					onChange={(e) => onChange({ ...value, ssid: e.target.value })}
					autoComplete="off"
				/>
			</Field>
			<Field label="Тип безопасности" htmlFor="enc">
				<Select
					id="enc"
					value={value.encryption}
					onChange={(e) =>
						onChange({
							...value,
							encryption: e.target.value as WifiPayload['encryption'],
							password:
								e.target.value === 'nopass' ? '' : value.password,
						})
					}
				>
					<option value="WPA">WPA / WPA2 / WPA3</option>
					<option value="WEP">WEP</option>
					<option value="nopass">Без пароля (открытая)</option>
				</Select>
			</Field>
			{value.encryption !== 'nopass' ? (
				<Field label="Пароль" htmlFor="wifi-pass">
					<Input
						id="wifi-pass"
						type="text"
						value={value.password}
						onChange={(e) => onChange({ ...value, password: e.target.value })}
						autoComplete="off"
					/>
				</Field>
			) : null}
			<label className="flex items-center gap-2 text-sm">
				<input
					type="checkbox"
					checked={value.hidden}
					onChange={(e) => onChange({ ...value, hidden: e.target.checked })}
					className="h-4 w-4"
				/>
				Скрытая сеть
			</label>
			<p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
				QR-код Wi‑Fi может содержать пароль в открытом виде. Не публикуйте его
				там, где пароль не должен быть виден посторонним.
			</p>
		</div>
	)
}

function VCardForm ({
	value,
	onChange,
}: {
	value: VCardPayload
	onChange: (v: VCardPayload) => void
}) {
	const fields: Array<{ key: keyof VCardPayload; label: string; id: string }> = [
		{ key: 'firstName', label: 'Имя', id: 'fn' },
		{ key: 'lastName', label: 'Фамилия', id: 'ln' },
		{ key: 'organization', label: 'Компания', id: 'org' },
		{ key: 'title', label: 'Должность', id: 'title' },
		{ key: 'phone', label: 'Телефон', id: 'vphone' },
		{ key: 'email', label: 'Email', id: 'vemail' },
		{ key: 'url', label: 'Сайт', id: 'vurl' },
		{ key: 'address', label: 'Адрес', id: 'vaddr' },
	]
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			{fields.map((field) => (
				<Field key={field.id} label={field.label} htmlFor={field.id}>
					<Input
						id={field.id}
						value={value[field.key]}
						onChange={(e) =>
							onChange({ ...value, [field.key]: e.target.value })
						}
					/>
				</Field>
			))}
		</div>
	)
}

function EmailForm ({
	value,
	onChange,
}: {
	value: EmailPayload
	onChange: (v: EmailPayload) => void
}) {
	return (
		<div className="space-y-4">
			<Field label="Адрес" htmlFor="email">
				<Input
					id="email"
					type="email"
					value={value.address}
					onChange={(e) => onChange({ ...value, address: e.target.value })}
				/>
			</Field>
			<Field label="Тема" htmlFor="subject">
				<Input
					id="subject"
					value={value.subject}
					onChange={(e) => onChange({ ...value, subject: e.target.value })}
				/>
			</Field>
			<Field label="Текст письма" htmlFor="body">
				<Textarea
					id="body"
					value={value.body}
					onChange={(e) => onChange({ ...value, body: e.target.value })}
					rows={4}
				/>
			</Field>
		</div>
	)
}

function SmsForm ({
	value,
	onChange,
}: {
	value: SmsPayload
	onChange: (v: SmsPayload) => void
}) {
	return (
		<div className="space-y-4">
			<Field label="Номер" htmlFor="sms-phone">
				<Input
					id="sms-phone"
					value={value.phone}
					onChange={(e) => onChange({ ...value, phone: e.target.value })}
					placeholder="+79991234567"
				/>
			</Field>
			<Field label="Сообщение" htmlFor="sms-msg">
				<Textarea
					id="sms-msg"
					value={value.message}
					onChange={(e) => onChange({ ...value, message: e.target.value })}
					rows={3}
				/>
			</Field>
		</div>
	)
}

function WhatsAppForm ({
	value,
	onChange,
}: {
	value: WhatsAppPayload
	onChange: (v: WhatsAppPayload) => void
}) {
	return (
		<div className="space-y-4">
			<Field
				label="Международный номер"
				htmlFor="wa"
				hint="Только цифры, без +. Пример: 79991234567"
			>
				<Input
					id="wa"
					value={value.phone}
					onChange={(e) => onChange({ ...value, phone: e.target.value })}
					inputMode="numeric"
				/>
			</Field>
			<Field label="Сообщение (необязательно)" htmlFor="wa-msg">
				<Textarea
					id="wa-msg"
					value={value.message}
					onChange={(e) => onChange({ ...value, message: e.target.value })}
					rows={3}
				/>
			</Field>
		</div>
	)
}

function LocationForm ({
	value,
	onChange,
}: {
	value: LocationPayload
	onChange: (v: LocationPayload) => void
}) {
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			<Field label="Широта" htmlFor="lat" hint="−90…90">
				<Input
					id="lat"
					type="number"
					step="any"
					value={Number.isFinite(value.latitude) ? value.latitude : ''}
					onChange={(e) =>
						onChange({ ...value, latitude: e.target.valueAsNumber })
					}
				/>
			</Field>
			<Field label="Долгота" htmlFor="lon" hint="−180…180">
				<Input
					id="lon"
					type="number"
					step="any"
					value={Number.isFinite(value.longitude) ? value.longitude : ''}
					onChange={(e) =>
						onChange({ ...value, longitude: e.target.valueAsNumber })
					}
				/>
			</Field>
		</div>
	)
}

function EventForm ({
	value,
	onChange,
}: {
	value: EventPayload
	onChange: (v: EventPayload) => void
}) {
	return (
		<div className="space-y-4">
			<Field label="Название" htmlFor="ev-title">
				<Input
					id="ev-title"
					value={value.title}
					onChange={(e) => onChange({ ...value, title: e.target.value })}
				/>
			</Field>
			<div className="grid gap-4 sm:grid-cols-2">
				<Field label="Начало" htmlFor="ev-start" hint="Местное время в часовом поясе вашего устройства">
					<Input
						id="ev-start"
						type="datetime-local"
						value={value.start}
						onChange={(e) => onChange({ ...value, start: e.target.value })}
					/>
				</Field>
				<Field label="Конец" htmlFor="ev-end">
					<Input
						id="ev-end"
						type="datetime-local"
						value={value.end}
						onChange={(e) => onChange({ ...value, end: e.target.value })}
					/>
				</Field>
			</div>
			<Field label="Место" htmlFor="ev-loc">
				<Input
					id="ev-loc"
					value={value.location}
					onChange={(e) => onChange({ ...value, location: e.target.value })}
				/>
			</Field>
			<Field
				label="Описание"
				htmlFor="ev-desc"
				hint="Совместимость с календарными приложениями не гарантируется для всех клиентов."
			>
				<Textarea
					id="ev-desc"
					value={value.description}
					onChange={(e) => onChange({ ...value, description: e.target.value })}
					rows={3}
				/>
			</Field>
		</div>
	)
}
