const view = (matrix) => matrix.map(row => row.map(cell => typeof cell === "number"?cell:cell.join(",")));
const isEqualArray = function (array1, array2) {
  var i = array1.length;
  if (i != array2.length) return false;

  while (i--) {
    if (array1[i] !== array2[i]) return false;
  }
  return true;
};

/*const SheetMatrix = [
  [ 0, 9, 6, 0, 8, 2, 1, 4, 0 ],
  [ 7, 4, 0, 0, 0, 0, 0, 3, 0 ],
  [ 0, 0, 2, 4, 7, 1, 0, 0, 0 ],
  [ 0, 2, 0, 1, 0, 7, 0, 6, 0 ],
  [ 0, 0, 0, 6, 0, 5, 8, 0, 4 ],
  [ 0, 6, 5, 0, 0, 0, 0, 0, 9 ],
  [ 2, 0, 3, 8, 1, 0, 0, 0, 0 ],
  [ 0, 8, 4, 7, 6, 0, 0, 0, 0 ],
  [ 0, 0, 0, 5, 0, 0, 4, 8, 1 ]
];*/

const SheetMatrix = [
  [ 0, 0, 0, 0, 5, 2, 6, 0, 0 ],
  [ 0, 0, 1, 6, 0, 0, 0, 0, 0 ],
  [ 7, 4, 0, 0, 8, 0, 9, 0, 0 ],
  [ 0, 0, 0, 5, 7, 4, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 5, 0 ],
  [ 0, 3, 7, 0, 0, 0, 0, 8, 1 ],
  [ 0, 0, 3, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 1, 0, 7, 0, 9, 0 ],
  [ 0, 6, 5, 0, 9, 0, 7, 0, 0 ]
];

const Numbers1to9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * @description 2次元配列(行列)の行(横),列(縦)を入れ替える
 * 
 * @param {*} array 変換したい配列
 * @returns {*} 変換済み配列
 */
const arrayTranspose = array => array[0].map((_, c) => array.map(r => r[c]));

/**
 * @description 指定されたマスの行(横)と列(縦)を見てそのマスのに入るであろう数値を推測する（複数の数値をもつ）
 * 
 * @param {*} matrix 入力された行列
 * @param {*} matrix_reverse 行列の縦横を入れ替えたもの
 * @param {*} pointer_row 行(横)番号
 * @param {*} pointer_col 列(縦)番号
 * @returns {*} セルの推測結果
 */
const PredictByLine = (matrix, matrix_reverse, pointer_row, pointer_col) =>{
  // 座標指定されたマスを取得。もし空白マスであれば空集合(配列)を代入
  const cell = (v => v <= 0?[]:v)(matrix[pointer_row][pointer_col]);
  // そのマスが集合でないかつ空白でなければそのマスの数値を返却
  if(typeof cell === "number" && cell >= 0) return cell;

  // そのマスの行(横)と列(縦)を変数に格納
  const row_line = matrix[pointer_row].filter(v => typeof v === "number" && v !== 0);
  const col_line = matrix_reverse[pointer_col].filter(v => typeof v === "number" && v !== 0);

  // 1~9の数列と行(横)の差集合を求める（1~9でその行に含まれない数字を調べる）
  const row_possibility = _.difference(Numbers1to9, row_line); 
  // 1~9の数列と列(縦)の差集合を求める（1~9でその列に含まれない数字を調べる）
  const col_possibility = _.difference(Numbers1to9, col_line);  
  // 求めた行列で入る可能性のある数値の積集合をもとめる（行,列どちらにも含まれる数字以外はそのマスには入らない）
  const cell_possibility = _.intersection(row_possibility, col_possibility);

  // 集合に1つしか値がなければ数値として返却（1つしかない=推測が完了となるから数値化）
  return (v => v.length <= 1?v[0]:v)(cell_possibility);
};

/**
 * @description 指定されたセルの座標から所属する3x3のマスを見てそのマスからセルに入るであろう数値を推測する（複数の数値をもつ）
 * 
 * @param {*} matrix 入力された行列
 * @param {*} pointer_row 行(横)番号
 * @param {*} pointer_col 列(縦)番号
 * @returns {*} セルの推測結果
 */
const PredictBy3x3cells = (matrix, pointer_row, pointer_col) =>{
  // 座標指定されたマスを取得。もし空白マスであれば空集合(配列)を代入
  const cell = (v => v <= 0?[]:v)(matrix[pointer_row][pointer_col]);
  // そのマスが集合でないかつ空白でなければそのマスの数値を返却
  if(typeof cell === "number" && cell >= 0) return cell;
  
  // 3x3の行列に分けた時の行番号と列番号
  const pointer_row_3x3 = Math.trunc(pointer_row/3);
  const pointer_col_3x3 = Math.trunc(pointer_col/3);
  // 上の座標から3x3の行列を抽出
  const matrix_3x3 = [0, 1, 2].map(row => [0, 1, 2].map(col => matrix[3*pointer_row_3x3+row][3*pointer_col_3x3+col]));
  // 2次元配列を1次元に変換し空白マスを排除
  const flat_matrix = matrix_3x3.flat().filter(v => v > 0);

  // 1~9の数列と1次元化した3x3の行列の差集合を求める（3x3のマスだけを見た時の可能性を推測）
  const cell_possibility_by_3x3 = _.difference(Numbers1to9, flat_matrix);
  // 3x3の行列を見た時の推測(↑)と既存在する推測の積集合を求める（過去の推測から必要ないものを排除する）
  const cell_possibility = _.intersection(cell_possibility_by_3x3, cell);
  
  // 集合に1つしか値がなければ数値として返却（1つしかない=推測が完了となるから数値化）
  return (v => v.length <= 1?v[0]:v)(cell_possibility);
}

/**
 * @description 2つの推測を行う
 * 
 * @param {*} matrix 入力された行列
 * @param {*} matrix_reverse 行列の縦横を入れ替えたもの
 * @param {*} pointer_row 行(横)番号
 * @param {*} pointer_col 列(縦)番号
 * @returns 2つの推測を行った結果が保存された行列
 */
const PredictByCell = (matrix, matrix_reverse, pointer_row, pointer_col) =>{
  // 推測結果を推測中セルに保存
  matrix[pointer_row][pointer_col] = PredictByLine(matrix, matrix_reverse, pointer_row, pointer_col);
  matrix[pointer_row][pointer_col] = PredictBy3x3cells(matrix, pointer_row, pointer_col);
  
  // 行列を返却
  return matrix;
}

const PredictNumberPlate = (matrix, probe=async (matrix)=>{}) =>{
  [...Array(10)].map(_ =>{
    // ポインターをひとマスずつ動かして推測を実行し結果を行列に格納
    matrix.map((row, rk) => row.map((_, ck) =>{
      matrix = PredictByCell(matrix, arrayTranspose(matrix), rk, ck);
    }));
    probe(matrix);
  });
};

PredictNumberPlate(SheetMatrix, async (matrix) =>{
  console.table(view(matrix));
});