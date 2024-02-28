const SheetMatrix = [
  [ 0, 9, 6, 0, 8, 2, 1, 4, 0 ],
  [ 7, 4, 0, 0, 0, 0, 0, 3, 0 ],
  [ 0, 0, 2, 4, 7, 1, 0, 0, 0 ],
  [ 0, 2, 0, 1, 0, 7, 0, 6, 0 ],
  [ 0, 0, 0, 6, 0, 5, 8, 0, 4 ],
  [ 0, 6, 5, 0, 0, 0, 0, 0, 9 ],
  [ 2, 0, 3, 8, 1, 0, 0, 0, 0 ],
  [ 0, 8, 4, 7, 6, 0, 0, 0, 0 ],
  [ 0, 0, 0, 5, 0, 0, 4, 8, 1 ]
];

const arrayTranspose = array => array[0].map((_, c) => array.map(r => r[c]));
const Numbers1to9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/*const searchGuessForLines = () =>{
  const guess_rows = matrix.map((row) =>{
    return row.map(v =>{
      if(v > 0) return v;
      const guess_cell = [];
      numbers.map(num =>{
        if(row.includes(num)) guess_cell.push(num);
      });
      return guess_cell;
    });
  });
  return guess_rows;
};*/

/*
const predictForCells = (mx, mx_rev, row_pointer, col_pointer) =>{
  const num = mx[row_pointer][col_pointer];
  const row = mx[row_pointer];
  const col = mx_rev[col_pointer];

  const row_possiblity_exists = lineNumbersArray.filter(v => !row.includes(v));
  console.warn(row_possiblity_exists)
  const col_possiblity_exists = lineNumbersArray.filter(v => !col.includes(v));
  console.error(col_possiblity_exists)
  const rc_possibility_exists = [...new Set(row_possiblity_exists)].filter(v => new Set(col_possiblity_exists).has(v));
  

  return rc_possibility_exists;
};*/

//const ReplaceSpace = (matrix) => matrix.map(row => row.map(cell => cell>=0?[]:cell));


/**
 * @description 指定されたマスの行(横)と列(縦)を見てそのマスのに入るであろう数値を推測する（複数の数値をもつ）
 * 
 * @param {*} matrix // 入力された行列
 * @param {*} matrix_reverse // 行列の縦横を入れ替えたもの
 * @param {*} pointer_row // 行(横)番号
 * @param {*} pointer_col // 列(縦)番号
 * @returns {*} cell_possibility
 */
const PredictByLine = (matrix, matrix_reverse, pointer_row, pointer_col) =>{
  const cell = (v => v <= 0?[]:v)(matrix[pointer_row][pointer_col]);
  // そのマスが空白でなければそのマスの数値を返却
  if(cell >= 0) return cell;

  // そのマスの行(横)と列(縦)を変数に格納
  const row_line = matrix[pointer_row];
  const col_line = matrix_reverse[pointer_col];

  // 1~9の数列と行(横)の差集合を求める（1~9でその行に含まれない数字を調べる）
  const row_possibility = _.difference(Numbers1to9, row_line);
  // 1~9の数列と列(縦)の差集合を求める（1~9でその列に含まれない数字を調べる）
  const col_possibility = _.difference(Numbers1to9, col_line);
  // 求めた行列で入る可能性のある数値の積集合をもとめる（行列どちらにも含まれる数字以外はそのマスには入らない）
  const cell_possibility = _.intersection(row_possibility, col_possibility);

  return cell_possibility;
};

const PredictBy3x3cells = (matrix, matrix_reverse, pointer_row, pointer_col) =>{
  const cell = matrix[pointer_row][pointer_col];
  
  // 3x3の行列に分けた時の行番号と列番号
  const pointer_row_3x3 = Math.trunc((pointer_row+1)/3);
  const pointer_col_3x3 = Math.trunc((pointer_col+1)/3);
  // 上の座標から3x3の行列を抽出
  const matrix_3x3 = [0, 1, 2].map(row => [0, 1, 2].map(col => matrix[3*pointer_row_3x3+row][3*pointer_col_3x3+col]));
  const flat_matrix = matrix_3x3.flat().filter(v => v > 0);
  console.table(matrix_3x3);
  console.log(flat_matrix);
}

const PredictCell = (matrix, matrix_reverse, pointer_row, pointer_col) =>{

}

const predictPointer = (mx) =>{
  const mx_rev = arrayTranspose(mx)
  const mx_result = mx;
  mx.map((mx_row, key_row) =>{
    mx_row.map((_, key_col) =>{
      if(mx[key_row][key_col] >= 0) return;
      const result = predictForCells(mx, mx_rev, key_row, key_col)
      result.length <= 1?mx_result[key_row][key_col] = result[0]:mx_result[key_row][key_col] = result; 
    });
  });
  return mx_result;
}

const main = () =>{
  console.table(SheetMatrix);
  const SheetMatrixReverse = arrayTranspose(SheetMatrix)
  /*console.table(predictForCells(matrix, mx_rev, 0, 0))*/

  console.table(PredictByLine(SheetMatrix, SheetMatrixReverse, 0, 0));
  PredictBy3x3cells(SheetMatrix, SheetMatrixReverse, 0, 0);
};

main();