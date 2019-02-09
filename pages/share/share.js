
Page({


  data: {
    acttype:'旅游',
    start_name:'深圳技术大学',
    end_name:"撒大苏打阿斯顿阿迪等斯阿斯顿阿德",
    creater_name:'等等的',
    person_type:"学生",
    date:"2018.09.05",
    time:"10:30",
    surplus:"8",
    tripmode:"拼车",
    people1:"5",
    note:"的哈阿斯顿大十大阿三打算 阿萨时代阿瑟东",
    sex:'女生',
 

  },
  onShareAppMessage:function(res){
    return{
      title:"快上车，没时间解释了！",
      path:"pages/share/share"

    }

  }

})