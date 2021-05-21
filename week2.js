const url = 'https://vue3-course-api.hexschool.io';
const path = 'vue3_api';

const username = document.querySelector('#username')
const password = document.querySelector('#password')
const btnLogin = document.querySelector('.js-btn')

// 登入驗證
btnLogin.addEventListener('click', login)
function login(){
  const userData = {
    username: username.value,
    password: password.value
  }
  axios.post(`${url}/admin/signin`, userData).then(res => {
    if(userData.username==='' || userData.password===''){
      alert('帳號密碼不得為空')
    }
    if(res.data.success){
      alert('登入成功')
      username.value = ''
      password.value = ''
      console.log(res.data)
      const token = res.data.token
      const expired = res.data.expired
      // 把 token 存在瀏覽器的 cookie 裡
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
    }
  })
}
const app = {
  data: {
    products: []
  },
  getData(){
    axios.get(`${url}/api/${path}/admin/products`).then(res => {
      console.log('取得產品列表', res.data)
      this.data.products = res.data.products
      this.render()
    })
  },
  render(){
    const template = this.data.products.map(item => `
      <tr>
        <td>${item.category}</td>
        <td width="120">
          範例原價
        </td>
        <td width="120">
          範例價格
        </td>
        <td width="100">
          <span class="">範例啟用狀態</span>
        </td>
        <td width="120">
          <button type="button" class="btn btn-sm btn-outline-danger move deleteBtn" data-action="remove" data-id="${item.id}"> 刪除 </button>
        </td>
      </tr>
    `
    ).join('')
    const productList = document.querySelector('#productList')
    productList.innerHTML = template
    const productCount = document.querySelector('#productCount')
    productCount.textContent = this.data.products.length
    const delBtn = document.querySelectorAll('.deleteBtn')
    delBtn.forEach(btn => {
      btn.addEventListener('click', this.delProduct)
    })
  },
  delProduct(e){
    console.log(e)
    const id = e.target.dataset.id
    console.log(id)
    axios.delete(`${url}/api/${path}/admin/product/${id}`).then(res => {
      console.log('刪除產品', res.data)
      app.getData()
    })
  },
  init(){
    // 把 token 從 cookie 取出
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    console.log(token)
    axios.defaults.headers.common['Authorization'] = token; // headers 帶入 token
    // 登入狀態確認
    axios.post(`${url}/api/user/check`).then(res => {
      console.log('登入狀態', res.data)
      this.getData()
    })
  }
}
app.init()