import 'dotenv/config'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { User } from '../models/userModel.js'
import { Website } from '../models/websiteModel.js'
import { generateResponse } from '../config/openRouter.js'

const BASE = `http://localhost:${process.env.PORT || 8000}`
const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Test Cafe</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #111; color: #fff; }
    nav, section { padding: 1.5rem; max-width: 960px; margin: 0 auto; }
    nav { display: flex; gap: 1rem; flex-wrap: wrap; border-bottom: 1px solid #333; }
    button { background: #fff; color: #111; border: none; padding: .6rem 1rem; border-radius: 999px; cursor: pointer; }
    .page { display: none; padding: 2rem 0; }
    .page.active { display: block; }
    img { max-width: 100%; border-radius: 1rem; margin-top: 1rem; }
    @media (max-width: 768px) { nav { justify-content: center; } }
  </style>
</head>
<body>
  <nav>
    <button onclick="showPage('home')">Home</button>
    <button onclick="showPage('about')">About</button>
    <button onclick="showPage('contact')">Contact</button>
  </nav>
  <section id="home" class="page active">
    <h1>ShivForge Test Cafe</h1>
    <p>Premium coffee and pastries in downtown.</p>
    <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80" alt="Coffee" />
  </section>
  <section id="about" class="page"><h2>About</h2><p>Family-owned since 2018.</p></section>
  <section id="contact" class="page"><h2>Contact</h2><p>hello@testcafe.example</p></section>
  <script>
    function showPage(id) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById(id).classList.add('active');
    }
  </script>
</body>
</html>`

const results = []

const log = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

const request = async (path, { method = 'GET', body, cookie } = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: `token=${cookie}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = text
  }
  return { status: res.status, data }
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI)

  let user = await User.findOne({ email: 'test@shivforge.local' })
  if (!user) {
    user = await User.create({
      name: 'Test User',
      email: 'test@shivforge.local',
      avatar: '',
      credits: 100,
    })
  } else if (user.credits < 20) {
    user.credits = 100
    await user.save()
  }

  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' })

  log('Backend reachable', true, BASE)
  try {
    await generateResponse('Return JSON only: {"message":"ok","code":"<html></html>"}')
    log('OpenRouter API key', true, 'configured and reachable')
  } catch (error) {
    log('OpenRouter API key', false, error.message)
  }

  let website = await Website.findOne({ user: user._id, title: 'Test Cafe Website' })
  if (!website) {
    website = await Website.create({
      user: user._id,
      title: 'Test Cafe Website',
      latestCode: SAMPLE_HTML,
      conversation: [
        { role: 'user', content: 'Create a modern coffee shop website' },
        { role: 'ai', content: 'Created a responsive test cafe website.' },
      ],
    })
  } else {
    website.latestCode = SAMPLE_HTML
    await website.save()
  }

  const byId = await request(`/api/website/getbyid/${website._id}`, { cookie: token })
  log(
    'Fetch website by id',
    byId.status === 200 && byId.data.latestCode?.includes('ShivForge Test Cafe'),
    `status ${byId.status}`,
  )

  const deploy = await request(`/api/website/deploy/${website._id}`, { cookie: token })
  log(
    'Deploy website',
    deploy.status === 200 && deploy.data.url?.includes('/site/'),
    deploy.data.url || `status ${deploy.status}`,
  )

  const slug = website.slug || deploy.data.url?.split('/site/')[1]
  if (slug) {
    website.slug = slug
    await website.save()
  }

  const live = await request(`/api/website/getbyslug/${slug}`)
  log(
    'Public live site by slug',
    live.status === 200 && live.data.latestCode?.includes('<!DOCTYPE html>'),
    `status ${live.status}`,
  )

  const unauth = await request('/api/website/getall')
  log('Protected route without auth', unauth.status === 400, `status ${unauth.status}`)

  if (process.env.OPENROUTER_API_KEY && !process.env.OPENROUTER_API_KEY.includes('YOUR_OPENROUTER')) {
    const generate = await request('/api/website/generate', {
      method: 'POST',
      cookie: token,
      body: { prompt: 'A minimal portfolio site for a photographer' },
    })
    log(
      'Generate website via API',
      generate.status === 201 && generate.data.websiteId,
      generate.status === 201
        ? `websiteId ${generate.data.websiteId}, credits left ${generate.data.remainingCredits}`
        : generate.data?.message || `status ${generate.status}`,
    )

    if (generate.status === 201) {
      const aiSite = await request(`/api/website/getbyid/${generate.data.websiteId}`, { cookie: token })
      const parsed = aiSite.data?.latestCode?.includes('<!DOCTYPE html>')
      log('Generated HTML is valid document', parsed, parsed ? 'contains doctype' : 'missing doctype')
    }
  } else {
    log('Generate website via API', false, 'skipped — set OPENROUTER_API_KEY in backend/.env')
  }

  const passed = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok).length
  console.log(`\nSummary: ${passed} passed, ${failed} failed`)
  console.log(`Test editor: ${process.env.FRONTEND_URL || process.env.Frontend_URL || 'http://localhost:5173'}/editor/${website._id}`)
  console.log(`Test live site: ${process.env.FRONTEND_URL || process.env.Frontend_URL || 'http://localhost:5173'}/site/${slug}`)

  await mongoose.disconnect()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(async (error) => {
  console.error(error)
  await mongoose.disconnect().catch(() => {})
  process.exit(1)
})
