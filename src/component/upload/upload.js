import React from 'react';
import { Upload,Button, Icon } from 'antd';
 
const fileList = []; //上来装载上传图片或文件的数据
const props = {
    action: '/user/uploadimg',  //这是你要跳转到后台的地址
    listType: 'picture',//<span>	</span>这个是控件的属性，你可以不看它，也可以上蚂蚁金服上面看
    defaultFileList: [...fileList],
}
 
class UploadImage extends React.Component {
 
    render() {
        return (
 
            <div>
                <Upload {...props}>
                    <Button><Icon type="upload" /> 添加</Button>
                </Upload>
            </div>
        );
    }
}
export default UploadImage