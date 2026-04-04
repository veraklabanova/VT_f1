import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function VerifyEmailPage() {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <CardTitle>Ověřte svůj email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Na vaši emailovou adresu jsme odeslali ověřovací odkaz. Klikněte na
          něj pro dokončení registrace.
        </p>
        <p className="text-sm text-muted-foreground">
          Nedostali jste email? Zkontrolujte složku spam nebo se{' '}
          <Link href="/register" className="text-primary hover:underline">
            zaregistrujte znovu
          </Link>
          .
        </p>
        <Link href="/login">
          <Button variant="outline" className="mt-4">
            Zpět na přihlášení
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
