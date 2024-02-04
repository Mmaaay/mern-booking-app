import { test, expect } from '@playwright/test';

const UI_URL = "http://localhost:5173/"

test('should allow the user to sign in', async ({ page }) => {
  await page.goto(UI_URL)

  await page.getByRole("link" , {name : "Sign In"}).click()

  await expect(page.getByRole("heading" , {name : "Sign In"})).toBeVisible()

  await page.locator("[name=email]").fill("11@1.com")
  await page.locator("[name=password]").fill("123123123")
  
  await page.getByRole("button" , {name : "Login"}).click()

  await expect(page.getByText("Login in Successful!")).toBeVisible()

  await expect(page.getByRole("link" , {name : "My Booking"})).toBeVisible()
  await expect(page.getByRole("link" , {name : "My Hotels"})).toBeVisible()
  await expect(page.getByRole("button" , {name : "Sign Out"})).toBeVisible()
});


test('should allow user to sign up' , async ({page}) => {

  const testEmail = `test_register_${Math.floor(Math.random()*90000)+10000}@test.com`

  await page.goto(`${UI_URL}register`)

  await expect(page.getByRole("heading" , {name : "Create an account"})).toBeVisible()

  await page.locator("[name=firstName]").fill("ahmed")
  await page.locator("[name=lastName]").fill("ahmed")
  await page.locator("[name=email]").fill(testEmail)
  await page.locator("[name=password]").fill("123123123")
  await page.locator("[name=confirmPassword]").fill("123123123")

  await page.getByRole("button" , {name:"Create Account"}).click()

  await expect(page.getByText("Registration Success!")).toBeVisible()





})
