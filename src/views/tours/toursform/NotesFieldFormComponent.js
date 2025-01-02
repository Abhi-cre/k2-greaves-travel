import React from "react";
import {ArrayHelper} from "../../../helpers/arrayhelper";
import {USER_NAME} from "../../../helpers/constants";
import { Editor, EditorTools } from "@progress/kendo-react-editor";
import '@progress/kendo-theme-default/dist/all.css';
const {
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignRight,
    AlignCenter,
    Indent,
    Outdent,
    OrderedList,
    UnorderedList,
  } = EditorTools;
  
class NotesFieldFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {NotesData:[],notes:''};
    }
    handleNotesInput(index: number, key: string, value: any) {       
        this.setState({
            NotesData:  this.props.NotesData.map((item: any, k: number) => {                
                if (index == k) {
                    item[key] = value;
                }
                return item;
            })
        });
        }
        handleChangeEditor = (e) => {
           if(e.html.length<=2500)
           {
            this.setState({notes:e.html}); 
           }
           else
           {
            alert('More than 2500 characters is not allowed.')
           } 
           }
        handleChange = (e) => {
            const name = e.target.name;
            let  value = e.target.value;        
            this.setState({ ...this.state, [name]: value });
            }
            addNotes()
            {
                if(this.state.notes.trim()!='')
                {
                    this.props.addNotes({'id':0,"tourRecordId":0,'notes':this.state.notes,'notesFrom':localStorage.getItem(USER_NAME)});
                    setTimeout(()=>{
                        this.setState({notes:''})
                    })
                }
            }
    render(){
       
        return(
          
            <React.Fragment>
                 {(this.props.showField=='yes' || this.props.NotesData.length>0 || this.props.NotesList.length>0)?<div className="col-md-6">
                 <div className="row g-3 align-items-center notebox">
                                <div className="mb-3 col-md-10">
                                {(this.props.showField=='yes' || this.props.NotesData.length>0)?<label  className="form-label"> Notes</label>:''}

                                {(this.props.showField=='yes')?<Editor
                            value={this.state.notes}
          tools={[
            [Bold, Italic, Underline],
            [AlignLeft, AlignCenter, AlignRight],
            [OrderedList, UnorderedList, Indent, Outdent]
          ]}
          
          name="notes"
          onChange={this.handleChangeEditor}
        />:''}
        {(this.props.showField=='yes')?<p>Max length of text is 2500 characters.</p>:''}
                                    
                                </div>
                                {(this.props.showField=='yes')?<div className="mb-3 col-md-2">
                                    <button type="button" className="btn btn-sm btn-primary rounded mt-2" onClick={()=>this.addNotes()}><i className="fa-solid fa-plus"></i> Add</button>
                                </div>:''}
                            </div>
                            {(this.props.NotesData.length>0 || this.props.NotesList.length>0)?<div className="table-responsive">
                                <table className="table table-striped rounded border mb-0">
                                    <tbody>
                                        <tr>
                                            <th className="width150">Notes by</th>
                                            <th>Notes</th>
                                        </tr>
                                        {this.props.NotesData.map((item,key)=>{
                                        return(<tr key={`notes-${key}`}>
                                              <td>{ArrayHelper.getValue(item,'notesFrom')}</td>
                                    <td><div className="list-group-item-text mb-0 fs"  dangerouslySetInnerHTML={{ __html: ArrayHelper.getValue(item,'notes').replaceAll('\n', '<br/>') }} /></td>
                                           
                                        </tr>)
                                        })}
                                         {this.props.NotesList.map((item,key)=>{
                                   
                                   return( <tr key={`notes11-${key}`}>
                           <td>{ArrayHelper.getValue(item,'notesFrom')}</td>
                           <td colSpan={2}><div className="list-group-item-text mb-0 fs"  dangerouslySetInnerHTML={{ __html: ArrayHelper.getValue(item,'notes').replaceAll('\n', '<br/>') }} /></td>
                           
                          
                       </tr>)
                       })}
                                 
        
                                    </tbody>
                                </table>
                            </div>:''}
                            
                            </div>:''}
            </React.Fragment>
        )
    }
}  



export default  NotesFieldFormComponent;