import Editor, {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  BtnUndo,
  Separator,
  Toolbar,
  createButton
} from 'react-simple-wysiwyg';

const BtnAlignLeft = createButton('Canh trai', 'L', 'justifyLeft');
const BtnAlignCenter = createButton('Canh giua', 'C', 'justifyCenter');
const BtnAlignRight = createButton('Canh phai', 'R', 'justifyRight');

export default function RichTextEditor({ value, onChange, placeholder }) {
  return (
    <Editor
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      containerProps={{
        className: 'rsw-editor min-h-[320px] overflow-hidden rounded-md border border-slate-300 bg-white'
      }}
    >
      <Toolbar>
        <BtnUndo />
        <BtnRedo />
        <Separator />
        <BtnStyles />
        <Separator />
        <BtnBold />
        <BtnItalic />
        <BtnUnderline />
        <BtnStrikeThrough />
        <Separator />
        <BtnAlignLeft />
        <BtnAlignCenter />
        <BtnAlignRight />
        <Separator />
        <BtnBulletList />
        <BtnNumberedList />
        <Separator />
        <BtnLink />
        <BtnClearFormatting />
      </Toolbar>
    </Editor>
  );
}
