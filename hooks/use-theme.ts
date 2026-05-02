"use client"

import { useEffect, useState } from "react"

type Theme = "dark" | "light"

const STORAGE_KEY = "arali-theme"

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  localStorage.setItem(STORAGE_KEY, theme)
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY)
    const initialTheme: Theme = savedTheme === "light" ? "light" : "dark"
    applyTheme(initialTheme)
    setTheme(initialTheme)
  }, [])

  function toggleTheme() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark"
      applyTheme(nextTheme)
      return nextTheme
    })
  }

  return { theme, toggleTheme, isDark: theme === "dark" }
}
