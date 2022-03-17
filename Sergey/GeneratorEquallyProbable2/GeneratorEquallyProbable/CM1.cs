using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;

namespace GeneratorEquallyProbable
{
    public partial class CM1 : Form
    {
        /// <summary>
        /// Объем выборки
        /// </summary>
        public static int CountNumbers;
        public int Y0;
        public int Y1;
        public int M;
        /// <summary>
        /// Число интервалов
        /// </summary>
        public int CountIntervals;
        /// <summary>
        /// Математическое ожидание
        /// </summary>
        public double Mx;
        /// <summary>
        /// Дисперсия
        /// </summary>
        public double Dx;
        /// <summary>
        /// Второй момент
        /// </summary>
        public double Moment2;
        /// <summary>
        /// Третий момент
        /// </summary>
        public double Moment3;
        public List<double> Sequence = new List<double>();
        /// <summary>
        /// Нормализованная последовательность
        /// </summary>
        public List<double> SequenceNorm = new List<double>();
        /// <summary>
        /// Отсортированная последовательность
        /// </summary>
        public List<double> SequenceSort = new List<double>();
        /// <summary>
        /// Последовательность плотности распределения
        /// </summary>
        public List<int> ProbabilityDensity = new List<int>();
        /// <summary>
        /// Нормализованная последовательность плотности распределения
        /// </summary>
        public List<double> ProbabilityDensityNorm = new List<double>();
        /// <summary>
        /// Последовательность плотности равномерного распределения
        /// </summary>
        public List<double> EquallyProbabilityDensity = new List<double>();
        /// <summary>
        /// Последовательность функции рапределения
        /// </summary>
        public List<int> DistributionFunction = new List<int>();
        /// <summary>
        /// Нормализованная последовательность функции рапределения
        /// </summary>
        public List<double> DistributionFunctionNorm = new List<double>();
        /// <summary>
        /// Последовательность функции равномерного распределения
        /// </summary>
        public List<double> EquallyDistributionFunction = new List<double>();

        public List<double> KolmogorovPlus = new List<double>();
        public List<double> KolmogorovMinus = new List<double>();
        /// <summary>
        /// Последовательность единиц и нулей
        /// </summary>
        public List<int> SequenceOneZero = new List<int>();

        /// <summary>
        /// Инициализация формы
        /// </summary>
        public CM1()
        {
            InitializeComponent();
            comboBoxDistribution.SelectedIndex = 0;
            panelInitialData13.Visible = true;
            panelInitialData4.Visible = false;
            panelInitialData13.Location = new Point(13, 3);
            panelInitialData4.Location = new Point(13, 3);
        }
        /// <summary>
        /// Случайная величина аддитивным методом
        /// </summary>
        /// <returns></returns>
        public double RandomAdditive()
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
        private void buttonGenerate_Click(object sender, EventArgs e)
        {
            Sequence.Clear();
            SequenceNorm.Clear();
            SequenceSort.Clear();
            ProbabilityDensity.Clear();
            ProbabilityDensityNorm.Clear();
            EquallyProbabilityDensity.Clear();
            DistributionFunction.Clear();
            DistributionFunction.Clear();
            DistributionFunctionNorm.Clear();
            EquallyDistributionFunction.Clear();
            KolmogorovPlus.Clear();
            KolmogorovMinus.Clear();
            listNumber.Text = "";
            numericUpDownCountIntervals.Enabled = true;

            CountNumbers = (int)numericUpDownN.Value;
            CountIntervals = (int)numericUpDownCountIntervals.Value;

            switch (comboBoxDistribution.SelectedItem)
            {
                case "Равновероятное распределение":
                    {
                        Y0 = (int)numericUpDownY1.Value;
                        M = (int)numericUpDownM.Value;
                        Y1 = (int)numericUpDownY2.Value;

                        for (int i = 0; i < CountNumbers; i++)
                        {
                            Sequence.Add(RandomAdditive());
                            if (i < 50)
                                listNumber.Text += Sequence[i].ToString() + "\n";
                        }
                        break;
                    }
                case "Какой-то распределение":
                    {
                        for (int i = 0; i < CountNumbers; i++)
                        {
                            double Fx = (double)i / CountNumbers;
                            SequenceNorm.Add(Formuls.X(Fx));
                            if (i < 50)
                                listNumber.Text += SequenceNorm[i].ToString() + "\n";
                        }
                        for (int i = 0; i < CountNumbers; i++)
                        {
                            Sequence.Add(SequenceNorm[i] / SequenceNorm.Max());
                        }
                        break;
                    }
                case "Нормальное распределение":
                    {
                        Random random = new Random();
                        double k = Math.Sqrt(8.0 / Math.PI);
                        double r;
                        double x;
                        for (int i = 0; i < CountNumbers; i++)
                        {
                            r = random.NextDouble();
                            Sequence.Add(Math.Log((1 + r) / (1 - r)) / k);
                            r = random.NextDouble();
                            if (r < 0.5)
                                Sequence[i] = -Sequence[i];
                            if (i < 50)
                                listNumber.Text += Sequence[i].ToString() + "\n";
                        }
                        break;
                    }
                case "Экспоненциальное распределение":
                    {

                        break;
                    }
                case "Гамма - распределение":
                    {

                        break;
                    }
                default:
                    break;
            }
            //Рассчет статистических данных
            Mx = Formuls.GetMx(Sequence);
            Dx = Formuls.GetD(Sequence);
            Moment2 = Formuls.Get2Moment(Sequence);
            Moment3 = Formuls.Get3Moment(Sequence);

            textBoxMx.Text = Mx.ToString();
            textBoxD.Text = Dx.ToString();
            textBox2Moment.Text = Formuls.Get2Moment(Sequence).ToString();
            textBox3Moment.Text = Formuls.Get3Moment(Sequence).ToString();

            //Тест серии единиц
            TestLengthSeria();

            SequenceSort = Sequence;
            SequenceSort.Sort();

            double min = SequenceSort.Min();
            double max = SequenceSort.Max();
            double lengthPart = (max - min) / CountIntervals;
            //Построение гистограммы частот
            for (int i = 0; i < CountIntervals; i++)
            {
                ProbabilityDensity.Add(0);
                for (int j = 0; j < SequenceSort.Count(); j++)
                    if (Sequence[j] >= min + lengthPart * i &&
                            Sequence[j] < min + lengthPart * (i + 1))
                        ProbabilityDensity[i]++;
            }
            for (int i = 0; i < CountIntervals; i++)
                ProbabilityDensityNorm.Add((double)ProbabilityDensity[i] / CountNumbers);
            DrawHistogramm(ProbabilityDensityNorm, CountIntervals);
            //Построение статистической функции распределения
            DistributionFunction.Add(ProbabilityDensity[0]);
            for (int i = 1; i < CountIntervals; i++)
                DistributionFunction.Add(DistributionFunction[i - 1] + ProbabilityDensity[i]);
            for (int i = 0; i < CountIntervals; i++)
                DistributionFunctionNorm.Add((double)DistributionFunction[i] / CountNumbers);

            DrawGraph(DistributionFunctionNorm, CountIntervals);

            //Проверка по критерию Пирсона
            CheckPirson();
            //Проверка по критерию Колмогорова
            CheckKolmogorov();

        }
        /// <summary>
        /// Гистограмма
        /// </summary>
        /// <param name="parArr"></param>
        private void DrawHistogramm(List<double> parList, int parCount)
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
                                panel1.Height - (int)(parList[i] * (double)panel1.Height / parList.Max()),
                                widthColumn,
                                panel1.Height));
                gPanel.DrawString(parList[i].ToString(),
                    new Font("Arial", 7),
                    new SolidBrush(Color.Black),
                    (widthColumn + intervalColumn) * i,
                    panel1.Height - (int)(parList[i] * (double)panel1.Height / parList.Max()));
            }
        }
        /// <summary>
        /// График
        /// </summary>
        /// <param name="parArr"></param>
        private void DrawGraph(List<double> parList, int Count)
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
                        new PointF((widthColumn + intervalColumn) * i, panel1.Height - (int)(parList[i] * panel1.Height / parList.Max())),
                        new PointF((widthColumn + intervalColumn) * (i - 1), panel1.Height - (int)(parList[i - 1] * panel1.Height / parList.Max())));
                gPanel.DrawString(parList[i].ToString(),
                    new Font("Arial", 7),
                    new SolidBrush(Color.Black),
                    (widthColumn + intervalColumn) * i,
                    panel1.Height - (int)(parList[i] * (double)panel1.Height / parList.Max()));
            }
        }
        /// <summary>
        /// Сброс лабы
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

            textBoxHi2Nabl.Clear();
            textBoxDnPlus.Clear();
            textBoxDnMinus.Clear();
            textBoxDn.Clear();
            textBox4dn.Clear();

            textBoxCountOne.Clear();
            textBoxCountSeriaOne.Clear();
            textBoxMxOne.Clear();
            textBoxDOne.Clear();
            textBoxAverageLengthOne.Clear();
            textBoxZdown.Clear();
            textBoxZup.Clear();
        }
        /// <summary>
        /// Изменить число интервалов
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void numericUpDownCountIntervals_ValueChanged(object sender, EventArgs e)
        {
            CountIntervals = (int)numericUpDownCountIntervals.Value;
            buttonGenerate_Click(sender, e);
        }
        private void моделированиеСетодомМонтеКарлоToolStripMenuItem_Click(object sender, EventArgs e) { }
        private void моделированиеСлучайныхБлужданийToolStripMenuItem_Click(object sender, EventArgs e) { }
        private void тактическоеПланированиеЭкспериментаToolStripMenuItem_Click(object sender, EventArgs e) { }
        /// <summary>
        /// Выбор распределения
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void comboBoxDistribution_SelectionChangeCommitted(object sender, EventArgs e)
        {
            numericUpDownCountIntervals.Enabled = false;
            switch (comboBoxDistribution.SelectedItem)
            {
                case "Равновероятное распределение":
                    {
                        panelInitialData13.Visible = true;
                        panelInitialData4.Visible = false;

                        panelY1.Visible = true;
                        panelY2.Visible = true;
                        panelM.Visible = true;
                        panelN.Visible = true;

                        numericUpDownY1.Value = 4091;
                        numericUpDownY2.Value = 16379;
                        numericUpDownM.Value = 16384;
                        numericUpDownN.Value = 1000;
                        break;
                    }
                case "Какой-то распределение":
                    {
                        panelInitialData13.Visible = true;
                        panelInitialData4.Visible = false;

                        panelY1.Visible = false;
                        panelM.Visible = false;
                        panelY2.Visible = false;
                        panelN.Visible = true;

                        numericUpDownN.Value = 1000;
                        break;
                    }
                case "Нормальное распределение":
                    {
                        panelInitialData13.Visible = false;
                        panelInitialData4.Visible = true;

                        panelU.Visible = true;
                        panelD2.Visible = true;
                        panelN.Visible = true;

                        numericUpDownU.Value = 0;
                        numericUpDownD2.Value = (decimal)0.1;
                        numericUpDownN.Value = 1000;
                        break;
                    }
                case "Экспоненциальное распределение":
                    {

                        break;
                    }
                case "Гамма - распределение":
                    {

                        break;
                    }
                default:
                    break;
            }
            buttonClear_Click(sender, e);
        }
        /// <summary>
        /// Проверка по критерию Пирсона
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void CheckPirson()
        {
            for (int i = 0; i < CountIntervals; i++)
                EquallyProbabilityDensity.Add(1.0 / CountIntervals);

            //Рассчитанный хи квадрат
            double hi2 = Formuls.GetHi2(ProbabilityDensity, CountNumbers, EquallyProbabilityDensity);
            textBoxHi2Nabl.Text = hi2.ToString();
            //число степеней свободы
            int NumberOfDegreesOfFreedom = Formuls.GetNumberOfDegreesOfFreedom(CountIntervals, 0);
            textBoxNumberOfDegreesOfFreedom.Text = NumberOfDegreesOfFreedom.ToString();
            //Проверка гипотезы
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
        /// <summary>
        /// Проверка по критерию Колмогорова
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        public void CheckKolmogorov()
        {
            for (int i = 1; i <= CountNumbers; i++)
            {
                KolmogorovPlus.Add((double)i / CountNumbers - SequenceSort[i - 1]);
                KolmogorovMinus.Add(SequenceSort[i - 1] - (double)(i) / CountNumbers);
            }

            double Kolmogorov = Math.Max(KolmogorovPlus.Max(), KolmogorovMinus.Max());
            double alpha = (double)numericUpDownLvlZna4.Value;
            double p = Math.Sqrt(Math.Pow(Math.Log(alpha, 2.73), 2) / (2 * CountNumbers));
            p = 0.964;


            textBoxDnPlus.Text = KolmogorovPlus.Max().ToString();
            textBoxDnMinus.Text = KolmogorovMinus.Max().ToString();
            textBoxDn.Text = Kolmogorov.ToString();
            textBox4dn.Text = p.ToString();

            if (Kolmogorov <= p)
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
        public void TestLengthSeria()
        {
            int CountOne = 0;
            for (int i = 0; i < CountNumbers; i++)
            {
                if (Sequence[i] < 0.75)
                    SequenceOneZero.Add(0);
                else
                {
                    SequenceOneZero.Add(1);
                    CountOne++;
                }
            }

            int CountSeriaOne = 0;
            for (int i = 1; i < CountNumbers; i++)
                if (SequenceOneZero[i - 1] == 1 && SequenceOneZero[i] == 0)
                    CountSeriaOne++;
            if (SequenceOneZero[CountNumbers - 1] == 1)
                CountSeriaOne++;


            double MxOne = Formuls.GetMxOne(Sequence, CountOne);
            double DOne = Formuls.GetDOne(Sequence, CountOne);
            double AverageLengthOne = Formuls.GetAverageLengthOne(CountOne, CountSeriaOne);


            double alpha = 0.999;
            double betta = 1 - alpha;
            double quantile = 3.30;

            double Zdown = MxOne - quantile * Math.Sqrt(DOne / CountSeriaOne);

            double Zup = MxOne + quantile * Math.Sqrt(DOne / CountSeriaOne);


            textBoxCountOne.Text = CountOne.ToString();
            textBoxCountSeriaOne.Text = CountSeriaOne.ToString();
            textBoxMxOne.Text = MxOne.ToString();
            textBoxDOne.Text = DOne.ToString();
            textBoxAverageLengthOne.Text = AverageLengthOne.ToString();
            textBoxZdown.Text = Zdown.ToString();
            textBoxZup.Text = Zup.ToString();

            if (AverageLengthOne >= Zdown && AverageLengthOne <= Zup)
            {
                labelTestLengthSeria.BackColor = Color.GreenYellow;
                labelTestLengthSeria.Text = "Гипотеза принимается";
            }
            else
            {
                labelTestLengthSeria.BackColor = Color.Red;
                labelTestLengthSeria.Text = "Гипотеза отвергается";
            }
        }
        private void checkPirson_Click(object sender, EventArgs e)
        {
            //CheckPirson(arraySort);
        }
        private void checkKolmogorov_Click(object sender, EventArgs e)
        {
            //CheckKolmogorov(arraySort);
        }
        private void testLengthSeria_Click(object sender, EventArgs e)
        {
            //TestLengthSeria(array);
        }


    }
}
