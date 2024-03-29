import { test, expect } from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("11@1.com");
  await page.locator("[name=password]").fill("123123123");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Login in Successful!")).toBeVisible();
});

test("should allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}add-hotel`);

  await page.locator('[name="name"]').fill("Test Hotel");
  await page.locator('[name="city"]').fill("Test City");
  await page.locator('[name="country"]').fill("Test Country");
  await page
    .locator('[name="description"]')
    .fill(
      " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae varius mi. Etiam tempor facilisis facilisis. Suspendisse libero enim, lobortis eget semper eu, congue nec lorem. Aenean in arcu sem. Aliquam erat volutpat. Vestibulum dignissim, eros vitae egestas ultricies, diam nunc eleifend purus, eget viverra mauris justo quis lectus. Aenean lacinia massa id tortor finibus finibus at id turpis.Nullam sagittis sagittis dolor, non congue velit pellentesque in. Integer vel dui tempus, commodo lorem sed, dignissim lorem. Aenean et nisl nunc. Etiam eget bibendum dolor. Sed nec elit nunc. In rutrum est felis, vitae suscipit nisi auctor tristique. Sed non imperdiet tellus. Donec tempor pharetra dolor, sed vestibulum eros tempus ac. Donec pharetra erat quis nibh aliquet, a finibus lorem lacinia. Vestibulum pellentesque magna ac sem finibus, sed laoreet est tristique. In ac auctor justo, vel vestibulum leo. Suspendisse potenti. "
    );
  await page.locator('[name="pricePerNight"]').fill("100");
  await page.selectOption('select[name="starRating"]', "3");

  await page.getByText("Budget").click();

  await page.getByLabel("Spa").check();
  await page.getByLabel("Parking").check();

  await page.locator('[name="adultCount"]').fill("2");
  await page.locator('[name="childCount"]').fill("4");

  await page.setInputFiles('[name="imageFiles"]', [
    path.join(
      __dirname,
      "../data/hotel_images/",
      "pexels-andrea-davis-11535806.jpg"
    ),
  ]);

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Added")).toBeVisible({ timeout: 500000 });
});

test("should display hotels", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await expect(page.getByText("Dublin Getaways")).toBeVisible();
  // await expect(page.getByText("Lorem ipsum dolor sit amet")).toBeVisible({});
  await expect(page.getByText("Dublin , Ireland")).toBeVisible();
  await expect(page.getByText("All Inclusive")).toBeVisible();
  await expect(page.getByText("119 Per Night")).toBeVisible();
  await expect(page.getByText("2 Adults , 3 Children")).toBeVisible();
  await expect(page.getByText("2 Star Rating")).toBeVisible();

  await expect(
    page.getByRole("link", { name: "View Details" }).first()
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
});

test("should edit hotel", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await page.getByRole("link", { name: "View Details" }).first().click();

  await page.waitForSelector('[name="name"]', { state: "attached" });
  await expect(page.locator('[name="name"]')).toHaveValue("Dublin Getaways UPDATED");
  await page.locator('[name="name"]').fill("Dublin Getaways UPDATED");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel Saved!")).toBeVisible();

  await page.reload();

  await expect(page.locator('[name="name"]')).toHaveValue("Dublin Getaways UPDATED" );
  await page.locator('[name="name"]').fill("Dublin Getaways");
  await page.getByRole("button", { name: "Save" }).click();
});

test("should show hotel search results", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("Dublin");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Hotels found in Dublin")).toBeVisible();
  await expect(page.getByText("Dublin Getaways")).toBeVisible();
}); 
test("should show hotel detail", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("Dublin");
  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("Dublin Getaways").click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();
});


test("should book hotel", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("Dublin");

  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formattedDate = date.toISOString().split("T")[0];
  await page.getByPlaceholder("Check-out Date").fill(formattedDate);

  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("Dublin Getaways").click();
  await page.getByRole("button", { name: "Book now" }).click();

  await expect(page.getByText("Total Cost: $357.00")).toBeVisible();

  const stripeFrame = page.frameLocator("iframe").first();
  await stripeFrame
    .locator('[placeholder="Card number"]')
    .fill("4242424242424242");
  await stripeFrame.locator('[placeholder="MM / YY"]').fill("04/30");
  await stripeFrame.locator('[placeholder="CVC"]').fill("242");
  await stripeFrame.locator('[placeholder="ZIP"]').fill("24225");

  await page.getByRole("button", { name: "Confirm Booking" }).click();
  await expect(page.getByText("Booking Saved!")).toBeVisible({timeout : 500000});

  await page.getByRole("link", { name: "My Booking" }).click();
  await expect(page.getByText("Dublin Getaways")).toBeVisible();
});