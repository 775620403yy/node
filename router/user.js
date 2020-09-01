const router = require('express').Router()
const db = require('./mysql')

router.post('/login',(req,res)=>{
    let user = req.body.user
    let mima = req.body.pwd
    let sql = 'SELECT * FROM t_user WHERE username=? AND pwd=?';
    db.query(sql,[user,mima],(err,data)=>{
        if(err) {
            res.send('数据库错误')
        }else {
            if(data.length>0) {
                // res.send('<script>alert("登录成功");location.href="1.html"</script>')
                res.send('登陆成功')
            }else {
                res.send('用户名或密码错误')
            }
        }
    })
})
//获取学生列表数据
router.get('/user',(req,res)=>{
    let curpage = req.query.cur
    let tpage = req.query.tpage
    let start = (curpage-1)*tpage
    let sql = 'select * from students limit ?,?'
    db.query(sql,[start,Number(tpage)],(err,data)=>{
        if(err){
            res.send({code:500,message:'数据库出错，请联系管理员'})
        }else {
            res.send({code:200,data:data})
        }
    })
})
//获取总页数
router.get('/total',(req,res)=>{
    //数据库查询总行数，返回单行单列数据,
    let sql = 'select count(*) as num from students'
    db.query(sql,[],(err,data)=>{
        if(err){
            res.send({code:500,message:'数据库出错，请联系管理员'})
        }else {
            //表格中返回数据是一个数组对象，是单行单列就是下标为0为第一行直接列名(data[0].count(*))的话不行，要在数据库语句取别名
            res.send({code:200,num:data[0].num})
        }
    })
})
//删除
router.get('/student/del',(req,res)=>{
    let id = req.query.id
    let sql = 'delete from students where ids=?';
    db.query(sql,[id],(err,data)=>{
        if(err){
            res.send({code:500,msg:'数据库出错'})
        }else{
           if(data.affectedRows>0) {
               res.send({code:200,msg:'删除成功'})
           }else{
               res.send({code:200,msg:'删除失败'})
           }
        }
    })
})
//查询
router.get('/search',(req,res)=>{
    let stuname = req.query.stuname
    let classid = req.query.classid
    let curpage = req.query.cur
    let tpage = req.query.tpage
    let start = (curpage-1)*tpage
    console.log(start,tpage);
    let sql = 'select * from students where 1=1'
    let param =[]
    if(stuname!='') {
        sql += ' and stuName like ?'
        param.push("%"+stuname+"%")
    }
    if(classid!=-1) {
        sql += ' and classid=?'
        param.push(classid)
    }
    sql += ' limit ?,?'
    param.push(start,Number(tpage))
    db.query(sql,param,(err,data)=>{
        if(err){
            res.send({code:500,msg:'数据库出错，请联系管理员'})
            console.log(err);
        }else{
           res.send({code:200,data:data})
        }
    })
})
//获取班级列表数据
router.get('/getClass',(req,res)=>{
    let sql = 'select * from class'
    db.query(sql,[],(err,data)=>{
        if(err){
            res.send({code:500,msg:'数据库出错，请联系管理员'})
            console.log(err);
        }else{
            res.send({code:200,data:data})
        }
    })
})
//添加
router.get('/add',(req,res)=>{
    let id = req.query.id
    let name = req.query.name
   let addr = req.query.addr
   let sql = 'insert into students(ids,classid,stuName,sex,address,tel) values(null,?,?,default,?,123)'
   db.query(sql,[id,name,addr],(err,data)=>{
       if(err){
           console.log(err);
           res.send({code:500,msg:'数据库操作有误，请联系管理员'})
       }else{
           if(data.affectedRows>0){
            res.send({code:200,msg:'增加成功'})
           }else{
               res.send({code:200,msg:'增加失败'})
           }
           

       }
   })
})
// 修改
router.get('/edit',(req,res)=>{
    let id = req.query.id
    let clsid = req.query.clsid
    let addr = req.query.addr
    console.log(id);
    let sql = `update students set classid=${Number(clsid)},address='${addr}' where ids=${Number(id)}`
    // let sql = 'updata students set classid=?,address=? where=?'
    db.query(sql,(err,data)=>{
        if(err){
            console.log(err);
            res.send({code:500,msg:'数据库出错，请联系管理员'})
        }
        else{
           if(data.affectedRows>0){
               res.send({code:200,data:data})
           }else{
               res.send({code:200,msg:'更新失败'})
           }
        }
    })

})
module.exports=router