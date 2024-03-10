export const htmlExampleCode = (
  url: string,
) => `<!-- modify this form HTML and place wherever you want your form -->
<form
  id="form"
  action="${url}"
  method="POST"
>
  <label>
    Your email: <!-- use this to reply to respondants -->
    <input type="email" name="email">
  </label>
  <label>
    Your message:
    <textarea name="message"></textarea>
  </label>
  <!-- your other form fields go here -->
  <button type="submit">Send</button>
</form>`;

export const fetchExampleCode = (url: string) => `<script>
  const form = document.getElementById("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    fetch("${url}", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("success");
        } else {
          console.log("fail");
        }
      })
      .catch((error) => console.log(error));
  });
</script>`;

export const axiosExampleCode = (
  url: string,
) => `<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
  const form = document.getElementById("form");
  form.addEventListener("submit", () => {
    e.preventDefault();
    const formData = new FormData(form);
    axios
      .post("${url}", formData)
      .then((response) => {
        if (response.status === 200) {
          console.log("success");
        } else {
          console.log("fail");
        }
      })
      .catch((error) => console.log(error));
  });
</script>
`;
