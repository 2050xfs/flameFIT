const { createClient } = require('@supabase/supabase-js')

const url = 'https://jhihmijeqgmcydvlhrrl.supabase.co'
const key = 'sb_publishable_BH4Z0WdvFGSzjYn4-fYO0Q_o7fj96n6'

console.log('Testing Supabase Auth...')
console.log('URL:', url)
console.log('Key:', key)

try {
    const supabase = createClient(url, key)

    async function test() {
        const email = `flamefit.test.${Date.now()}@gmail.com`
        const password = 'Password123!'

        console.log(`Signing up ${email}...`)
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: 'Test User' }
            }
        })

        if (error) {
            console.error('Signup Error:', error.message)
        } else {
            console.log('User ID:', data.user?.id)
            console.log('Session:', data.session ? 'CREATED' : 'MISSING (Email Confirm Required)')
            if (data.session) {
                console.log('SUCCESS: We have a valid session!')
            }
        }
    }

    test()

} catch (e) {
    console.error('Initialization Error:', e.message)
}
