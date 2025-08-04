"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Copy, RefreshCw, Shield, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState([12])
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const generatePassword = () => {
    let charset = ""

    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"

    if (charset === "") {
      toast({
        title: "Error",
        description: "Please select at least one character type.",
        variant: "destructive",
      })
      return
    }

    let newPassword = ""
    for (let i = 0; i < length[0]; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    setPassword(newPassword)
    setCopied(false)
  }

  const copyToClipboard = async () => {
    if (!password) return

    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Password copied to clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy password.",
        variant: "destructive",
      })
    }
  }

  const getPasswordStrength = () => {
    if (!password) return { strength: "None", color: "bg-gray-300", score: 0 }

    let score = 0
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    if (score <= 2) return { strength: "Weak", color: "bg-red-500", score: score * 16.67 }
    if (score <= 4) return { strength: "Medium", color: "bg-yellow-500", score: score * 16.67 }
    return { strength: "Strong", color: "bg-green-500", score: score * 16.67 }
  }

  const strengthInfo = getPasswordStrength()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6 pt-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Password Generator</h1>
          </div>
          <p className="text-gray-600">Create strong, secure passwords instantly</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Generated Password
            </CardTitle>
            <CardDescription>Your secure password will appear here</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                value={password}
                readOnly
                placeholder="Click generate to create password"
                className="pr-12 font-mono text-sm"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={copyToClipboard}
                disabled={!password}
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            {password && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Password Strength:</span>
                  <span
                    className={`font-medium ${
                      strengthInfo.strength === "Strong"
                        ? "text-green-600"
                        : strengthInfo.strength === "Medium"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {strengthInfo.strength}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${strengthInfo.color}`}
                    style={{ width: `${strengthInfo.score}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password Settings</CardTitle>
            <CardDescription>Customize your password requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="length">Password Length</Label>
                <span className="text-sm font-medium bg-indigo-100 text-indigo-800 px-2 py-1 rounded">{length[0]}</span>
              </div>
              <Slider
                id="length"
                min={4}
                max={50}
                step={1}
                value={length}
                onValueChange={setLength}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>4</span>
                <span>50</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Character Types</Label>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                  <Label htmlFor="uppercase" className="text-sm font-normal">
                    Uppercase Letters (A-Z)
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
                  <Label htmlFor="lowercase" className="text-sm font-normal">
                    Lowercase Letters (a-z)
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                  <Label htmlFor="numbers" className="text-sm font-normal">
                    Numbers (0-9)
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                  <Label htmlFor="symbols" className="text-sm font-normal">
                    Symbols (!@#$%^&*)
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={generatePassword} className="w-full h-12 text-lg font-medium" size="lg">
          <RefreshCw className="w-5 h-5 mr-2" />
          Generate Password
        </Button>

        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>🔒 Your passwords are generated locally and never stored</p>
          <p>Always use unique passwords for different accounts</p>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-gray-600">
        Made with {"❤︎"} by{" "}
        <a
          href="https://suresh.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline"
        >
          Suresh Kaleyannan
        </a>
      </div>
    </div>
  )
}
