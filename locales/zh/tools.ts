export const tools = {
  json: {
    title: "JSON 工具箱",
    desc: "格式化、压缩及 JSON 转代码定义。",
    input: "输入 JSON",
    error: "错误",
    output: "输出",
    prettify: "美化",
    minify: "压缩",
    toTS: "转 TypeScript",
    toGo: "转 Go",
    toJava: "转 Java",
    toXML: "转 XML",
    toCSV: "转 CSV",
    openCsv: "在 CSV 工具中打开"
  },
  code: {
    title: "代码格式化",
    desc: "HTML, SQL, CSS 代码美化。",
    input: "输入代码",
    output: "格式化输出",
    paste: "在此粘贴代码..."
  },
  csv: {
    title: "CSV/Excel 处理器",
    desc: "查看、过滤及转换 CSV 或 Excel 文件。",
    import: "导入文件",
    export: "导出",
    rows: "行",
    cols: "列",
    search: "搜索...",
    toJson: "转 JSON",
    toSql: "转 SQL",
    toCsv: "转 CSV",
    toExcel: "转 Excel",
    download: "下载",
    clear: "清空"
  },
  encoder: {
    title: "编码转换工具",
    desc: "Base64, URL, 进制转换。",
    mode: "模式",
    input: "输入",
    result: "结果",
    type: "在此输入...",
    base64_enc: "Base64 编码",
    base64_dec: "Base64 解码",
    url_enc: "URL 编码",
    url_dec: "URL 解码",
    hex_bin: "文本转十六进制",
    bin_hex: "十六进制转文本"
  },
  hash: {
    title: "哈希计算器",
    desc: "计算 MD5, SHA1, SHA256, SHA512 散列值。",
    input_source: "输入源",
    text: "文本",
    type_placeholder: "输入以计算哈希...",
    or_file: "或上传文件",
    skipped: "文件模式已跳过",
    waiting: "等待输入..."
  },
  encrypt: {
    title: "加密工具",
    desc: "基础加解密测试。",
    demo_title: "XOR 加密演示",
    message: "消息",
    secret_placeholder: "秘密消息",
    secret_key: "密钥",
    action: "加密 / 解密",
    result: "结果"
  },
  jwt: {
    title: "JWT 调试器",
    desc: "解析并查看 JSON Web Tokens。",
    encoded: "编码 Token",
    header: "头部",
    payload: "载荷",
    invalid: "无效 Token"
  },
  pass: {
    title: "密码生成器",
    desc: "生成安全随机密码。",
    length: "长度",
    count: "数量",
    generate: "批量生成",
    click_generate: "点击生成"
  },
  color: {
    title: "调色板",
    desc: "取色器、格式转换及色阶生成。",
    picker: "取色器",
    shades: "色阶"
  },
  image: {
    title: "图片工具",
    desc: "图片转 Base64 及二维码生成。",
    base64_title: "图片转 Base64",
    qr_title: "二维码生成器",
    qr_placeholder: "输入 URL 或文本"
  },
  css: {
    title: "CSS 生成器",
    desc: "阴影与圆角可视化生成。",
    controls: "控制",
    border_radius: "圆角半径",
    box_shadow: "阴影",
    blur: "模糊",
    spread: "扩散",
    output: "CSS 输出"
  },
  editor: {
    title: "文本编辑与统计",
    desc: "文本处理、去重与字数统计。",
    editor: "编辑器",
    placeholder: "在此粘贴文本...",
    stats: "统计",
    chars: "字符",
    words: "单词",
    lines: "行数",
    actions: "操作",
    lorem: "插入 Lorem Ipsum",
    dedupe: "去重行",
    uppercase: "转大写",
    clear: "清空"
  },
  regex: {
    title: "正则表达式测试",
    desc: "测试与验证正则表达式。",
    pattern: "模式",
    flags: "修饰符",
    test_placeholder: "测试字符串...",
    matches: "匹配结果",
    invalid: "无效正则表达式",
    no_matches: "未找到匹配项",
    common_rules: "常用规则：",
    flag: {
      g: "g - 全局匹配",
      g_desc: "匹配所有出现的位置",
      i: "i - 忽略大小写",
      i_desc: "不区分大小写字母",
      m: "m - 多行模式",
      m_desc: "^和$匹配每行的开始和结束",
      gm: "gm - 全局多行",
      gm_desc: "全局匹配+多行模式",
      gi: "gi - 全局忽略大小写",
      gi_desc: "全局匹配+忽略大小写",
      custom: "自定义",
      custom_desc: "输入自定义flag组合"
    },
    rule: {
      any_char: "任意字符",
      digit: "数字 (0-9)",
      word_char: "单词字符 (a-z, 0-9, _)",
      whitespace: "空白字符",
      zero_or_more: "0次或多次",
      one_or_more: "1次或多次",
      zero_or_one: "0次或1次",
      start_str: "字符串开头",
      end_str: "字符串结尾",
      any_of: "a, b, c 中的任意一个"
    }
  },
  diff: {
    title: "文本比对",
    desc: "比较两段文本的差异。",
    original: "原始内容",
    changed: "修改后",
    result: "结果"
  }
};
