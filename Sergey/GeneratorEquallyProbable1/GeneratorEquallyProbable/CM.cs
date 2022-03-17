using System;
using System.Collections;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace GeneratorEquallyProbable
{
    public partial class CM : Form
    {
        public static int CountNumbers = 1000;
        public int Y0 = 4091;
        public int Y1 = 4096 * 4 - 5;
        public int M = 4096 * 4;
        public int CountIntervals = 16;
        double[] array = new double[10000];

        public CM()
        {
            InitializeComponent();
            Size = new Size(775, 492);
            lab1.Location = new Point(0, 27);
            lab2.Location = new Point(0, 27);
        }
        /// <summary>
        /// МатОжидание
        /// </summary>
        /// <param name="parArr">Последовательность</param>
        /// <returns></returns>
        private double GetMx(double[] parArr)
        {
            double sum = 0;
            for (int i = 0; i < parArr.Length; i++)
                sum += parArr[i];
            return sum / parArr.Length;
        }
        /// <summary>
        /// Дисперсия
        /// </summary>
        /// <param name="parArr">Последовательность</param>
        /// <returns></returns>
        private double GetD(double[] parArr)
        {
            double sum = 0;
            for (int i = 0; i < parArr.Length; i++)
                sum += Math.Pow(parArr[i] - GetMx(parArr), 2);
            return sum / parArr.Length;
        }
        /// <summary>
        /// Второй момент
        /// </summary>
        /// <param name="parArr">Последовательность</param>
        /// <returns></returns>
        private double Get2Moment(double[] parArr)
        {
            double sum = 0;
            for (int i = 0; i < parArr.Length; i++)
                sum += Math.Pow(parArr[i], 2);
            return sum / parArr.Length;
        }
        /// <summary>
        /// Третий момент
        /// </summary>
        /// <param name="parArr">Последовательность</param>
        /// <returns></returns>
        private double Get3Moment(double[] parArr)
        {
            double sum = 0;
            for (int i = 0; i < parArr.Length; i++)
                sum += Math.Pow(parArr[i], 3);
            return sum / parArr.Length;
        }
        /// <summary>
        /// Хи квадрат
        /// </summary>
        /// <param name="parM">Число вхождений в интервал</param>
        /// <param name="parCountNumbers">Число выборки</param>
        /// <param name="parP">Вероятность вхождения в интервал</param>
        /// <returns></returns>
        public double GetHi2(int[] parM, int parCountNumbers, double[] parP)
        {
            double sum = 0;
            double a;
            for (int i = 0; i < parM.Count(); i++)
            {
                a = parCountNumbers * parP[i];
                sum += (parM[i] - a) * (parM[i] - a) / a;
            }
            return sum;
        }
        /// <summary>
        /// Число степеней свободы
        /// </summary>
        /// <param name="parK"></param>
        /// <param name="parM"></param>
        /// <returns></returns>
        public int GetNumberOfDegreesOfFreedom(int parK, int parM)
        {
            return parK - parM - 1;
        }
        /// <summary>
        /// Случайная величина
        /// </summary>
        /// <returns></returns>
        public double Random()
        {
            int y = (Y0 + Y1) % M;
            Y0 = Y1;
            Y1 = y;
            return (double)y / M;
        }
        /// <summary>
        /// Генерация псевдослучайных чисел с равновероятным распределением
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void generate1_Click(object sender, EventArgs e)
        {
            listNumber.Text = "";
            numericUpDownCountIntervals.Enabled = true;

            Y0 = (int)numericUpDownY1.Value;
            M = (int)numericUpDownM.Value;
            Y1 = (int)numericUpDownY2.Value;
            CountNumbers = (int)numericUpDownN.Value;
            double[] arr = new double[CountNumbers];
            CountIntervals = (int)numericUpDownCountIntervals.Value;

            for (int i = 0; i < CountNumbers; i++)
            {
                arr[i] = Random();
                if (i < 30)
                    listNumber.Text += arr[i].ToString() + "\n";
            }
            Array.Sort(arr);
            array = arr;

            textBoxMx.Text = GetMx(arr).ToString();
            textBoxD.Text = GetD(arr).ToString();
            textBox2Moment.Text = Get2Moment(arr).ToString();
            textBox3Moment.Text = Get3Moment(arr).ToString();

            double min = arr.Min();
            double max = arr.Max();
            double lengthPart = (max - min) / CountIntervals;
            //плотность вероятности
            int[] a = new int[CountIntervals];
            //функция распределения
            int[] b = new int[CountIntervals];

            for (int i = 0; i < CountIntervals; i++)
            {
                a[i] = 0;
                for (int j = 0; j < arr.Length; j++)
                    if (arr[j] >= min + lengthPart * i && arr[j] < min + lengthPart * (i + 1))
                        a[i]++;
            }
            b[0] = a[0];
            for (int i = 1; i < CountIntervals; i++)
            {
                b[i] = b[i - 1] + a[i];
            }
            DrawHistogramm(a, CountIntervals);
            DrawGraph(b, CountIntervals);
        }

        /// <summary>
        /// Гистограмма
        /// </summary>
        /// <param name="parArr"></param>
        private void DrawHistogramm(int[] parArr, int parCount)
        {
            int intervalColumn = 5;
            int widthColumn = panel1.Width / parCount - intervalColumn;

            Graphics gPanel = panel1.CreateGraphics();

            gPanel.FillRectangle(new SolidBrush(Color.White),
                    new Rectangle(0, 0, panel1.Width, panel1.Height));

            for (int i = 0; i < parCount; i++)
            {
                gPanel.FillRectangle(new SolidBrush(Color.GreenYellow),
                    new Rectangle((widthColumn + intervalColumn) * i,
                                panel1.Height - (int)(parArr[i] * (double)panel1.Height / parArr.Max()),
                                widthColumn,
                                panel1.Height));
                gPanel.DrawString(parArr[i].ToString(),
                    new Font("Arial", 7),
                    new SolidBrush(Color.Black),
                    (widthColumn + intervalColumn) * i,
                    panel1.Height - (int)(parArr[i] * (double)panel1.Height / parArr.Max()));
            }
        }
        /// <summary>
        /// График
        /// </summary>
        /// <param name="parArr"></param>
        private void DrawGraph(int[] parArr, int Count)
        {
            int intervalColumn = 5;
            int widthColumn = panel1.Width / Count - intervalColumn;

            Graphics gPanel = panel2.CreateGraphics();
            gPanel.FillRectangle(new SolidBrush(Color.White),
                    new Rectangle(0, 0, panel2.Width, panel2.Height));


            for (int i = 0; i < Count; i++)
            {
                if (i != 0)
                    gPanel.DrawLine(new Pen(Color.Black, 3),
                        new PointF((widthColumn + intervalColumn) * i, panel1.Height - (int)(parArr[i] * panel1.Height / parArr.Max())),
                        new PointF((widthColumn + intervalColumn) * (i - 1), panel1.Height - (int)(parArr[i - 1] * panel1.Height / parArr.Max())));
                gPanel.DrawString(parArr[i].ToString(),
                    new Font("Arial", 7),
                    new SolidBrush(Color.Black),
                    (widthColumn + intervalColumn) * i,
                    panel1.Height - (int)(parArr[i] * (double)panel1.Height / parArr.Max()));
            }
        }

        private void numericUpDownM_ValueChanged(object sender, EventArgs e)
        {
            //numericUpDownY2.Value = numericUpDownM.Value - 5;
        }
        /// <summary>
        /// Перемещение по пунктам меню
        /// </summary>
        /// <param name="parMenuItem"></param>
        /// <param name="parPanel"></param>
        public void SwitchMenuItem(ToolStripMenuItem parMenuItem, Panel parPanel)
        {
            генераторПсевдослучайныхЧиселСРавновероятнымРаспределениемToolStripMenuItem.Enabled = true;
            проверкаКачестваГенераторовПсевдослучайныхЧиселToolStripMenuItem.Enabled = true;
            генерированиеСлучайныхВелечинСЗаданнымЗакономРаспределенияToolStripMenuItem.Enabled = true;
            генерированиеСлучайныхВеличинСНормальнымЗакономРаспределенияToolStripMenuItem.Enabled = true;
            генерированиеСлучайныхВеличинСЧастоИспользуемымиЗаконамиРаспределенияToolStripMenuItem.Enabled = true;
            моделированиеСетодомМонтеКарлоToolStripMenuItem.Enabled = true;
            моделированиеСлучайныхБлужданийToolStripMenuItem.Enabled = true;
            тактическоеПланированиеЭкспериментаToolStripMenuItem.Enabled = true;
            parMenuItem.Enabled = false;

            lab1.Visible = false;
            lab2.Visible = false;
            //lab3.Visible = false;
            //lab4.Visible = false;
            //lab5.Visible = false;
            //lab6.Visible = false;
            //lab7.Visible = false;
            //lab8.Visible = false;
            parPanel.Visible = true;
        }

        private void генераторПсевдослучайныхЧиселСРавновероятнымРаспределениемToolStripMenuItem_Click(object sender, EventArgs e)
        {
            SwitchMenuItem(генераторПсевдослучайныхЧиселСРавновероятнымРаспределениемToolStripMenuItem, lab1);
        }

        private void проверкаКачестваГенераторовПсевдослучайныхЧиселToolStripMenuItem_Click(object sender, EventArgs e)
        {
            SwitchMenuItem(проверкаКачестваГенераторовПсевдослучайныхЧиселToolStripMenuItem, lab2);
        }

        private void генерированиеСлучайныхВелечинСЗаданнымЗакономРаспределенияToolStripMenuItem_Click(object sender, EventArgs e)
        {
            //SwitchMenuItem(генерированиеСлучайныхВелечинСЗаданнымЗакономРаспределенияToolStripMenuItem);
        }

        private void генерированиеСлучайныхВеличинСНормальнымЗакономРаспределенияToolStripMenuItem_Click(object sender, EventArgs e)
        {
            //SwitchMenuItem(генерированиеСлучайныхВеличинСНормальнымЗакономРаспределенияToolStripMenuItem);
        }

        private void генерированиеСлучайныхВеличинСЧастоИспользуемымиЗаконамиРаспределенияToolStripMenuItem_Click(object sender, EventArgs e)
        {
            //SwitchMenuItem(генерированиеСлучайныхВеличинСЧастоИспользуемымиЗаконамиРаспределенияToolStripMenuItem);
        }

        private void моделированиеСетодомМонтеКарлоToolStripMenuItem_Click(object sender, EventArgs e)
        {
            //SwitchMenuItem(моделированиеСетодомМонтеКарлоToolStripMenuItem);
        }

        private void моделированиеСлучайныхБлужданийToolStripMenuItem_Click(object sender, EventArgs e)
        {
            //SwitchMenuItem(моделированиеСлучайныхБлужданийToolStripMenuItem);
        }

        private void тактическоеПланированиеЭкспериментаToolStripMenuItem_Click(object sender, EventArgs e)
        {
            //SwitchMenuItem(тактическоеПланированиеЭкспериментаToolStripMenuItem);
        }
        /// <summary>
        /// Сброс лабы 1
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void buttonClear_Click(object sender, EventArgs e)
        {
            listNumber.Clear();
            textBox2Moment.Clear();
            textBox3Moment.Clear();
            textBoxMx.Clear();
            textBoxD.Clear();
            Graphics gPanel1 = panel1.CreateGraphics();
            gPanel1.FillRectangle(new SolidBrush(Color.White),
                    new Rectangle(0, 0, panel1.Width, panel1.Height));
            Graphics gPanel2 = panel2.CreateGraphics();
            gPanel2.FillRectangle(new SolidBrush(Color.White),
                    new Rectangle(0, 0, panel2.Width, panel2.Height));
        }

        private void generate2_Click(object sender, EventArgs e)
        {
            listNumber2.Text = "";
            checkPirson.Enabled = true;
            checkKolmogorov.Enabled = true;
            testLengthSeria.Enabled = true;

            Y0 = (int)numericUpDownY12.Value;
            M = (int)numericUpDownM2.Value;
            Y1 = (int)numericUpDownY22.Value;
            CountNumbers = (int)numericUpDownN2.Value;
            double[] arr = new double[CountNumbers];

            for (int i = 0; i < CountNumbers; i++)
            {
                arr[i] = Random();
                if (i < 30)
                    listNumber2.Text += arr[i].ToString() + "\n";
            }
            Array.Sort(arr);
            array = arr;

            textBoxMx2.Text = GetMx(arr).ToString();
            textBoxD2.Text = GetD(arr).ToString();
            textBox2Moment2.Text = Get2Moment(arr).ToString();
            textBox3Moment2.Text = Get3Moment(arr).ToString();

            CheckPirson(arr);
            CheckKolmogorov(arr);
            TestLengthSeria(arr);
        }

        private void buttonClear2_Click(object sender, EventArgs e)
        {
            listNumber2.Clear();
            textBox2Moment2.Clear();
            textBox3Moment2.Clear();
            textBoxMx2.Clear();
            textBoxD2.Clear();
        }

        /// <summary>
        /// Проверка по критерию Пирсона
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void CheckPirson(double[] arr)
        {
            CountIntervals = (int)numericUpDownIntervals2.Value;
            double min = arr.Min();
            double max = arr.Max();
            double lengthPart = (max - min) / CountIntervals;
            //число вхождений в интервал
            int[] a = new int[CountIntervals];
            for (int i = 0; i < CountIntervals; i++)
            {
                a[i] = 0;
                for (int j = 0; j < arr.Length; j++)
                    if (arr[j] >= min + lengthPart * i && arr[j] < min + lengthPart * (i + 1))
                        a[i]++;
            }
            //вероятность попадания в интервал
            double[] p = new double[CountIntervals];
            for (int i = 0; i < CountIntervals; i++)
            {
                p[i] = 1.0 / CountIntervals;
            }
            //хи квадрат
            double hi2 = GetHi2(a, CountNumbers, p);
            textBoxHi2Nabl.Text = hi2.ToString();
            //число степеней свободы
            int r = GetNumberOfDegreesOfFreedom(CountIntervals, 0);

            if (hi2 < (double)numericUpDownHi2Tabl.Value)
            {
                labelCheckPirson.BackColor = Color.GreenYellow;
                labelCheckPirson.Text = "Гипотеза принимается";
            }
            else
            {
                labelCheckPirson.BackColor = Color.Red;
                labelCheckPirson.Text = "Гипотеза отвергается";
            }
        }
        public void CheckKolmogorov(double[] arr)
        {
            double min = arr.Min();
            double max = arr.Max();
            double[] DnPlus = new double[CountNumbers];
            double[] DnMinus = new double[CountNumbers];
            double[] Fx = new double[CountNumbers];

            for (int i = 1; i <= CountNumbers; i++)
            {
                Fx[i - 1] = (double)(i - 1) / CountNumbers;
                DnPlus[i - 1] = (double)i / CountNumbers - Fx[i - 1];
                DnMinus[i - 1] = Fx[i - 1] - (double)(i) / CountNumbers;
            }
            textBoxDnPlus.Text = DnPlus.Max().ToString();
            textBoxDnMinus.Text = DnMinus.Max().ToString();
            double Dn = Math.Max(DnPlus.Max(), DnMinus.Max());
            textBoxDn.Text = Dn.ToString();
            double alpha = (double)numericUpDownLvlZna4.Value;
            double dn = Math.Sqrt(Math.Pow(Math.Log(alpha, 2.73), 2) / (2 * CountNumbers));
            //dn = Dn * Math.Sqrt(CountNumbers);
            textBox4dn.Text = dn.ToString();

            if (Dn <= dn)
            {
                labelCheckKolmogorov.BackColor = Color.GreenYellow;
                labelCheckKolmogorov.Text = "Гипотеза принимается";
            }
            else
            {
                labelCheckKolmogorov.BackColor = Color.Red;
                labelCheckKolmogorov.Text = "Гипотеза отвергается";
            }

        }
        public void TestLengthSeria(double[] arr)
        {

        }



        private void numericUpDownCountIntervals_ValueChanged(object sender, EventArgs e)
        {
            CountIntervals = (int)numericUpDownCountIntervals.Value;
            double min = array.Min();
            double max = array.Max();
            double lengthPart = (max - min) / CountIntervals;
            //плотность вероятности
            int[] a = new int[CountIntervals];
            //функция распределения
            int[] b = new int[CountIntervals];

            for (int i = 0; i < CountIntervals; i++)
            {
                a[i] = 0;
                for (int j = 0; j < array.Length; j++)
                    if (array[j] >= min + lengthPart * i && array[j] < min + lengthPart * (i + 1))
                        a[i]++;
            }
            b[0] = a[0];
            for (int i = 1; i < CountIntervals; i++)
            {
                b[i] = b[i - 1] + a[i];
            }
            DrawHistogramm(a, CountIntervals);
            DrawGraph(b, CountIntervals);
        }

        private void checkPirson_Click(object sender, EventArgs e)
        {
            CheckPirson(array);
        }
        private void checkKolmogorov_Click(object sender, EventArgs e)
        {
            CheckKolmogorov(array);
        }
        private void testLengthSeria_Click(object sender, EventArgs e)
        {
            TestLengthSeria(array);
        }

        private void numericUpDownIntervals2_ValueChanged(object sender, EventArgs e)
        {
            numericUpDownAgreeOfFree2.Value = numericUpDownIntervals2.Value - 1;
        }
    }
}
