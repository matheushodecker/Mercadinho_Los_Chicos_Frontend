import { defineStore } from "pinia"
import { ref } from "vue"
import { PassageUser } from "@passageidentity/passage-elements/passage-user"

export default defineStore("auth", () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const passageUser = new PassageUser()

  const login = async () => {
    try {
      const authResult = await passageUser.userInfo()

      if (authResult) {
        user.value = {
          id: authResult.id,
          email: authResult.email,
          phone: authResult.phone,
          created_at: authResult.created_at,
          last_login_at: authResult.last_login_at,
          login_count: authResult.login_count,
          user_metadata: authResult.user_metadata,
        }
        isAuthenticated.value = true

        localStorage.setItem("passage_user", JSON.stringify(user.value))
        return { success: true }
      }

      throw new Error("Authentication failed")
    } catch (error) {
      console.error("Passage login error:", error)
      throw new Error("Erro ao fazer login com Passage")
    }
  }

  const logout = async () => {
    try {
      await passageUser.signOut()
    } catch (error) {
      console.error("Passage logout error:", error)
    } finally {
      user.value = null
      isAuthenticated.value = false
      localStorage.removeItem("passage_user")
    }
  }

  const checkAuthStatus = async () => {
    try {
      const authResult = await passageUser.userInfo()

      if (authResult) {
        user.value = {
          id: authResult.id,
          email: authResult.email,
          phone: authResult.phone,
          created_at: authResult.created_at,
          last_login_at: authResult.last_login_at,
          login_count: authResult.login_count,
          user_metadata: authResult.user_metadata,
        }
        isAuthenticated.value = true
        localStorage.setItem("passage_user", JSON.stringify(user.value))
      } else {
        const storedUser = localStorage.getItem("passage_user")
        if (storedUser) {
          user.value = JSON.parse(storedUser)
          isAuthenticated.value = true
        }
      }
    } catch (error) {
      console.error("Auth status check error:", error)
      user.value = null
      isAuthenticated.value = false
      localStorage.removeItem("passage_user")
    }
  }

  checkAuthStatus()

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus,
  }
})
