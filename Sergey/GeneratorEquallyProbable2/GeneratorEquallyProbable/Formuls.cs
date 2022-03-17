using System;
using System.Collections.Generic;
using System.Linq;

namespace GeneratorEquallyProbable
{
    public static class Formuls
    {
        /// <summary>
        /// МатОжидание
        /// </summary>
        /// <param name="parArr">Последовательность</param>
        /// <returns></returns>
        public static double GetMx(List<double> parList)
        {
            return parList.Sum() / parList.Count();
        }
        /// <summary>
        /// Дисперсия
        /// </summary>
        /// <param name="parArr">Последовательность</param>
        /// <returns></returns>
        public static double GetD(List<double> parList)
        {
            double sum = 0;
            double N = parList.Count();
            for (int i = 0; i < N; i++)
                sum += Math.Pow(parList[i] - GetMx(parList), 2);
            return sum / N;
        }
        /// <summary>
        /// Второй момент
        /// </summary>
        /// <param name="parArr">Последовательность</param>
        /// <returns></returns>
        public static double Get2Moment(List<double> parList)
        {
            double sum = 0;
            double N = parList.Count();
            for (int i = 0; i < N; i++)
                sum += Math.Pow(parList[i], 2);
            return sum / N;
        }
        /// <summary>
        /// Третий момент
        /// </summary>
        /// <param name="parArr">Последовательность</param>
        /// <returns></returns>
        public static double Get3Moment(List<double> parList)
        {
            double sum = 0;
            double N = parList.Count();
            for (int i = 0; i < N; i++)
                sum += Math.Pow(parList[i], 3);
            return sum / N;
        }
        /// <summary>
        /// Хи квадрат
        /// </summary>
        /// <param name="parM">Число вхождений в интервал</param>
        /// <param name="parCountNumbers">Число выборки</param>
        /// <param name="parP">Вероятность вхождения в интервал</param>
        /// <returns></returns>
        public static double GetHi2(List<int> parM, int parCountNumbers, List<double> parP)
        {
            double sum = 0;
            double a;
            for (int i = 0; i < parM.Count(); i++)
            {
                a = parCountNumbers * parP[i];
                sum += (double)((parM[i] - a) * (parM[i] - a)) / a;
            }
            return sum;
        }
        /// <summary>
        /// Число степеней свободы
        /// </summary>
        /// <param name="parK"></param>
        /// <param name="parM"></param>
        /// <returns></returns>
        public static int GetNumberOfDegreesOfFreedom(int parK, int parM)
        {
            return parK - parM - 1;
        }
        /// <summary>
        /// МатОжидание серии единиц
        /// </summary>
        public static double GetMxOne(List<double> parArr, int parCountOne)
        {
            double p = (double)parCountOne / parArr.Count();
            return p / (1 - p)+1;
        }
        /// <summary>
        /// Дисперсия серии единиц
        /// </summary>
        public static double GetDOne(List<double> parArr, int parCountOne)
        {
            double p = (double)parCountOne / parArr.Count();
            return p / Math.Pow(1 - p, 2);
        }
        /// <summary>
        /// Оценка средней длины серии единиц
        /// </summary>
        public static double GetAverageLengthOne(int parCountOne, int parCountSeriaOne)
        {
            return (double)parCountOne / parCountSeriaOne;
        }
        /// <summary>
        /// Функция распределения
        /// </summary>
        /// <param name="parX"></param>
        /// <returns></returns>
        public static double Fx(double parX)
        {
            if (parX >= 0 && parX < 0.5)
                return 0.8 * Math.Pow(parX, 2);
            else if (parX >= 0.5 && parX < 1)
                return 0.8 * Math.Pow(parX, 2);
            else if (parX >= 1)
                return 0.8 * Math.Pow(parX, 2);
            else
                return 0;
        }
        /// <summary>
        /// Обратная функция распределения
        /// </summary>
        /// <param name="parFx"></param>
        /// <returns></returns>
        public static double X(double parFx)
        {
            if (parFx >= 0 && parFx < 0.2)
                return Math.Sqrt(parFx / 0.8);
            else if (parFx >= 0.2 && parFx < 0.55)
                return (parFx + 0.15) / 0.7;
            else if (parFx >= 0.55 && parFx <= 1)
                return -Math.Log(1 - parFx) / 0.8;
            else
                return 0;
        }
    }
}
