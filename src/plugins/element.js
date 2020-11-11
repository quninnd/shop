import Vue from 'vue'
import {
  Button,
  Input,
  Form,
  FormItem,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  BreadcrumbItem,
  Breadcrumb,
  Card,
  Table,
  TableColumn,
  Pagination,
  Switch,
  Dialog,
  Alert,
  Tooltip,
  Select,
  Option,
  MessageBox,
  Row,
  Col,
  Tag,
  Tree
} from 'element-ui'

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

Vue.use(Tree)
Vue.use(Tag)
Vue.use(Col)
Vue.use(Row)
Vue.use(Option)
Vue.use(Select)
Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Switch)
Vue.use(Dialog)
Vue.use(Alert)
Vue.use(Tooltip)
